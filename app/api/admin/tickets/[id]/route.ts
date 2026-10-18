import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  ADMIN_COOKIE_NAME,
  isAllowedOrigin,
  verifyAdminSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const allowedStatuses = new Set([
  "Open",
  "In Progress",
  "Awaiting Your Reply",
  "Resolved",
  "Closed",
]);

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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const session = verifyAdminSession(
    cookieStore.get(ADMIN_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { error: "Your session has expired. Please log in again." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!id || id.length > 100) {
    return NextResponse.json(
      { error: "Invalid ticket identifier." },
      { status: 400 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > 20_000) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;
  const status = data.status;
  const resolution = data.resolution;
  const sendResolutionEmail = data.sendResolutionEmail === true;

  if (typeof status !== "string" || !allowedStatuses.has(status)) {
    return NextResponse.json(
      { error: "Invalid ticket status." },
      { status: 400 }
    );
  }

  if (
    typeof resolution !== "string" ||
    resolution.length > 10_000
  ) {
    return NextResponse.json(
      { error: "Resolution must be text up to 10,000 characters." },
      { status: 400 }
    );
  }

  if (sendResolutionEmail && !resolution.trim()) {
    return NextResponse.json(
      { error: "Enter a resolution before sending the resolution email." },
      { status: 400 }
    );
  }

  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    return NextResponse.json(
      { error: "Ticket service is unavailable." },
      { status: 503 }
    );
  }

  const supabase = createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // Read the existing ticket before updating it.
  const { data: ticket, error: readError } = await supabase
    .from("contact_messages")
    .select("id,ticket_number,name,email,message")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    console.error("Admin ticket lookup failed:", readError.code);
    return NextResponse.json(
      { error: "Unable to retrieve the ticket." },
      { status: 500 }
    );
  }

  if (!ticket || !ticket.ticket_number) {
    return NextResponse.json(
      { error: "Ticket not found." },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabase
    .from("contact_messages")
    .update({
      status,
      resolution: resolution.trim(),
      ...(sendResolutionEmail
        ? { resolution_email_status: "pending" }
        : {}),
    })
    .eq("id", id);

  if (updateError) {
    console.error("Admin ticket update failed:", updateError.code);
    return NextResponse.json(
      { error: "Unable to save ticket changes." },
      { status: 500 }
    );
  }

  if (!sendResolutionEmail) {
    return NextResponse.json({
      success: true,
      emailSent: null,
      message: "Ticket changes saved.",
    });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FROM_EMAIL;
  const replyTo = process.env.CONTACT_TO_EMAIL;

  if (!resendKey || !sender || !replyTo) {
    await supabase
      .from("contact_messages")
      .update({ resolution_email_status: "failed" })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      emailSent: false,
      message: "Ticket saved, but email configuration is incomplete.",
    });
  }

  const safeName = escapeHtml(ticket.name);
  const safeTicketNumber = escapeHtml(ticket.ticket_number);
  const safeMessage = escapeHtml(ticket.message);
  const safeResolution = escapeHtml(resolution.trim());
  const safeStatus = escapeHtml(status);

  try {
    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from: sender,
      to: [ticket.email],
      replyTo,
      subject: `Update on Moneyva ticket ${ticket.ticket_number}`,
      text: [
        `Dear ${ticket.name},`,
        "",
        `Your Moneyva ticket ${ticket.ticket_number} has been updated.`,
        `Current status: ${status}`,
        "",
        "Your original message:",
        ticket.message,
        "",
        "Resolution / update from Moneyva:",
        resolution.trim(),
        "",
        "If you need further assistance, please reply to this email.",
        "Regards,",
        "Moneyva Support Team",
      ].join("\n"),
      html: `
        <p>Dear ${safeName},</p>
        <p>Your Moneyva ticket <strong>${safeTicketNumber}</strong> has been updated.</p>
        <p><strong>Current status:</strong> ${safeStatus}</p>
        <h3>Your original message</h3>
        <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        <h3>Resolution / update from Moneyva</h3>
        <p>${safeResolution.replace(/\n/g, "<br>")}</p>
        <p>If you need further assistance, please reply to this email.</p>
        <p>Regards,<br>Moneyva Support Team</p>
      `,
    });

    if (result.error) {
      await supabase
        .from("contact_messages")
        .update({ resolution_email_status: "failed" })
        .eq("id", id);

      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Ticket saved, but the resolution email could not be sent.",
      });
    }

    const { error: emailStatusError } = await supabase
      .from("contact_messages")
      .update({
        resolution_email_status: "sent",
        resolution_email_sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (emailStatusError) {
      console.error(
        "Resolution email status update failed:",
        emailStatusError.code
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: "Ticket saved and resolution email sent.",
    });
  } catch {
    await supabase
      .from("contact_messages")
      .update({ resolution_email_status: "failed" })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      emailSent: false,
      message: "Ticket saved, but the resolution email could not be sent.",
    });
  }
}
