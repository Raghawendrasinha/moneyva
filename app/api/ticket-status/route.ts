import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        { error: "Status service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const redis = new Redis({ url: redisUrl, token: redisToken });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      prefix: "moneyva:ticket-status",
    });

    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const limit = await limiter.limit(ip);

    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
            ),
          },
        }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 2000) {
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
    const ticketNumber =
      typeof data.ticketNumber === "string"
        ? data.ticketNumber.trim().toUpperCase()
        : "";
    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    if (
      !/^MV-\d{8}-[A-F0-9]{6}$/.test(ticketNumber) ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid ticket number and email address." },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secret) {
      return NextResponse.json(
        { error: "Status service is temporarily unavailable." },
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

    // Fetch only the fields needed for verification and status display.
    const { data: matches, error } = await supabase
      .from("contact_messages")
      .select("ticket_number,email,status,status_updated_at")
      .eq("ticket_number", ticketNumber)
      .limit(10);

    if (error) {
      console.error("Ticket status lookup failed:", error.code);
      return NextResponse.json(
        { error: "Unable to check ticket status right now." },
        { status: 500 }
      );
    }

    const ticket = (matches ?? []).find(
      (item) => item.email.trim().toLowerCase() === email
    );

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket number or email address was not recognized." },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      ticketNumber: ticket.ticket_number,
      status: ticket.status,
      updatedAt: ticket.status_updated_at,
    });

    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to check ticket status right now." },
      { status: 503 }
    );
  }
}
