import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createTicketNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
  return `MV-${date}-${suffix}`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://moneyva.in",
      "https://www.moneyva.in",
    ]);

    if (origin && !allowedOrigins.has(origin)) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return NextResponse.json(
        { error: "Contact service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const redis = new Redis({ url: redisUrl, token: redisToken });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "moneyva:contact",
    });

    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
      "unknown";

    const rateLimit = await limiter.limit(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000))
            ),
          },
        }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > 12_000) {
      return NextResponse.json(
        { error: "Request is too large." },
        { status: 413 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    // Honeypot: silently accept automated bot submissions.
    if (typeof data.website === "string" && data.website.trim()) {
      return NextResponse.json({ success: true });
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const message =
      typeof data.message === "string" ? data.message.trim() : "";

    if (
      !name ||
      name.length > 100 ||
      !emailPattern.test(email) ||
      email.length > 254 ||
      message.length < 10 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Please check your name, email and message." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL;
    const sender = process.env.CONTACT_FROM_EMAIL;

    if (!supabaseUrl || !supabaseSecret || !resendKey || !recipient || !sender) {
      return NextResponse.json(
        { error: "Contact service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecret, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    const trackingToken = randomBytes(32).toString("base64url");
    const trackingTokenHash = hashToken(trackingToken);

    let ticketNumber = "";
    let savedId: string | null = null;

    // Retry if a generated ticket number or token collides with an existing record.
    for (let attempt = 0; attempt < 3; attempt++) {
      ticketNumber = createTicketNumber();

      const { data: saved, error: saveError } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          message,
          ticket_number: ticketNumber,
          status: "Open",
          tracking_token_hash: trackingTokenHash,
          acknowledgement_email_status: "pending",
        })
        .select("id")
        .single();

      if (!saveError && saved) {
        savedId = String(saved.id);
        break;
      }

      if (saveError?.code === "23505") {
        continue;
      }

      console.error("Moneyva ticket save failed:", saveError?.code);
      return NextResponse.json(
        { error: "We could not register your request. Please try again." },
        { status: 500 }
      );
    }

    if (!savedId) {
      return NextResponse.json(
        { error: "We could not generate a ticket. Please try again." },
        { status: 500 }
      );
    }

    const siteUrl = (
      process.env.SITE_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://www.moneyva.in"
        : "http://localhost:3000")
    ).replace(/\/+$/, "");

    const trackingUrl =
      `${siteUrl}/track-ticket?token=${encodeURIComponent(trackingToken)}`;

    const safeName = escapeHtml(name);
    const safeTicketNumber = escapeHtml(ticketNumber);
    const safeMessage = escapeHtml(message);

    const resend = new Resend(resendKey);

    const internalEmail = resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email,
      subject: `[${ticketNumber}] Moneyva enquiry from ${name}`,
      text:
        `Ticket Number: ${ticketNumber}\n` +
        `Status: Open\n` +
        `Name: ${name}\nEmail: ${email}\n\n` +
        `Message:\n${message}`,
      html:
        `<h2>New Moneyva enquiry</h2>` +
        `<p><strong>Ticket:</strong> ${safeTicketNumber}</p>` +
        `<p><strong>Status:</strong> Open</p>` +
        `<p><strong>Name:</strong> ${safeName}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Message:</strong></p><p>${safeMessage.replace(/\n/g, "<br>")}</p>`,
    });

    const acknowledgementEmail = resend.emails.send({
      from: sender,
      to: [email],
      replyTo: recipient,
      subject: `Moneyva support ticket ${ticketNumber} received`,
      text: [
        `Dear ${name},`,
        "",
        "Thank you for contacting Moneyva.",
        "We have received and registered your complaint/query.",
        "",
        "Your original message:",
        message,
        "",
        `Your Ticket Number is: ${ticketNumber}`,
        "Our team will review your message.",
        "We aim to respond within 3 working days.",
        "Please keep your ticket number for future reference.",
        `Track your ticket status securely: ${trackingUrl}`,
        "Thank you for your patience.",
        "Regards,",
        "Moneyva Support Team",
      ].join("\n"),
      html: `
        <p>Dear ${safeName},</p>
        <p>Thank you for contacting Moneyva.</p>
        <p>We have received and registered your complaint/query.</p>
        <h3>Your original message</h3>
        <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        <p>Your Ticket Number is: <strong>${safeTicketNumber}</strong></p>
        <p>Our team will review your message.</p>
        <p>We aim to respond within <strong>3 working days</strong>.</p>
        <p>Please keep your ticket number for future reference.</p>
        <p><a href="${escapeHtml(trackingUrl)}">Track your ticket status securely</a></p>
        <p>Thank you for your patience.</p>
        <p>Regards,<br>Moneyva Support Team</p>
      `,
    });

    // A failed email must not erase the ticket or encourage duplicate submissions.
    const [internalResult, acknowledgementResult] = await Promise.allSettled([
      internalEmail,
      acknowledgementEmail,
    ]);

    const internalFailed =
      internalResult.status === "rejected" ||
      Boolean(internalResult.value.error);

    const acknowledgementFailed =
      acknowledgementResult.status === "rejected" ||
      Boolean(acknowledgementResult.value.error);

    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({
        email_status: internalFailed ? "failed" : "sent",
        acknowledgement_email_status: acknowledgementFailed
          ? "failed"
          : "sent",
      })
      .eq("id", savedId);

    if (updateError) {
      console.error("Moneyva ticket email status update failed:", updateError.code);
    }

    if (internalFailed) {
      console.error("Moneyva internal notification email failed.");
    }

    if (acknowledgementFailed) {
      console.error("Moneyva customer acknowledgement email failed.");
    }

    return NextResponse.json({
      success: true,
      ticketNumber,
      acknowledgementEmailSent: !acknowledgementFailed,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
