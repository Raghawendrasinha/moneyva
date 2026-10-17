import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // Accept requests from the local app and the official Moneyva site.
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://moneyva.in",
      "https://www.moneyva.in",
    ]);

    if (origin && !allowedOrigins.has(origin)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    // Require persistent rate limiting in every environment.
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      console.error("Upstash rate-limiting configuration is incomplete.");
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

    // Prefer the platform-provided client IP header.
    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
      "unknown";

    const rateLimit = await limiter.limit(ip);

    if (!rateLimit.success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((rateLimit.reset - Date.now()) / 1000)
      );

      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 12_000) {
      return NextResponse.json({ error: "Message is too large." }, { status: 413 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;

    // Honeypot: bots may fill this hidden field; real users should leave it blank.
    if (typeof data.website === "string" && data.website.trim()) {
      return NextResponse.json({ success: true });
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const message = typeof data.message === "string" ? data.message.trim() : "";

    if (
      !name ||
      name.length > 100 ||
      !emailPattern.test(email) ||
      email.length > 254 ||
      message.length < 10 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Please check your name, email address and message." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL;
    const sender = process.env.CONTACT_FROM_EMAIL;

    if (!supabaseUrl || !supabaseSecret || !resendKey || !recipient || !sender) {
      console.error("Contact service environment variables are incomplete.");
      return NextResponse.json(
        { error: "Contact service is not configured yet. Please try again later." },
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

    // Save the enquiry before sending the email, so it isn't lost if email fails.
    const { data: saved, error: saveError } = await supabase
      .from("contact_messages")
      .insert({ name, email, message })
      .select("id")
      .single();

    if (saveError || !saved) {
      console.error("Could not save contact enquiry:", saveError?.message);
      return NextResponse.json(
        { error: "We couldn't save your message. Please try again." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);
    const { error: emailError } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email,
      subject: `Moneyva enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (emailError) {
      console.error("Contact notification failed:", emailError.message);
      await supabase
        .from("contact_messages")
        .update({ email_status: "failed" })
        .eq("id", saved.id);

      return NextResponse.json(
        { error: "Your message was saved, but the email notification failed." },
        { status: 502 }
      );
    }

    await supabase
      .from("contact_messages")
      .update({ email_status: "sent" })
      .eq("id", saved.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
