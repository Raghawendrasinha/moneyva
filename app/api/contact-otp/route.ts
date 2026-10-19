import { createHash, randomInt, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Resend } from "resend";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://moneyva.in",
    "https://www.moneyva.in",
  ]).has(origin);
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const action = body.action;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (action !== "send" && action !== "verify") {
      return NextResponse.json({ error: "Invalid OTP action." }, { status: 400 });
    }

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const resendKey = process.env.RESEND_API_KEY;
    const sender = process.env.CONTACT_FROM_EMAIL;

    if (!redisUrl || !redisToken || !resendKey || !sender) {
      return NextResponse.json(
        { error: "Email verification is temporarily unavailable." },
        { status: 503 },
      );
    }

    const redis = new Redis({ url: redisUrl, token: redisToken });
    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const ipLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(action === "send" ? 5 : 10, "10 m"),
      prefix: `moneyva:contact-otp:${action}:ip`,
    });

    const ipLimit = await ipLimiter.limit(ip);
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((ipLimit.reset - Date.now()) / 1000)),
            ),
          },
        },
      );
    }

    const emailKey = hash(email);

    if (action === "send") {
      const emailLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "15 m"),
        prefix: "moneyva:contact-otp:email",
      });

      const emailLimit = await emailLimiter.limit(emailKey);
      if (!emailLimit.success) {
        return NextResponse.json(
          { error: "Too many OTP requests for this email. Try again later." },
          { status: 429 },
        );
      }

      const otp = String(randomInt(100000, 1000000));
      const otpKey = `moneyva:contact-otp:code:${emailKey}`;

      await redis.set(otpKey, hash(otp), { ex: 600 });

      const result = await new Resend(resendKey).emails.send({
        from: sender,
        to: [email],
        subject: "Your Moneyva email verification code",
        text: `Your Moneyva verification code is ${otp}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
        html: `<p>Your Moneyva verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
      });

      if (result.error) {
        await redis.del(otpKey);
        console.error("Moneyva OTP email failed:", result.error.name);
        return NextResponse.json(
          { error: "We could not send the verification code. Please try again later." },
          { status: 502 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent. It expires in 10 minutes.",
      });
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Enter the six-digit verification code." }, { status: 400 });
    }

    const attemptsKey = `moneyva:contact-otp:attempts:${emailKey}`;
    const attempts = await redis.incr(attemptsKey);
    if (attempts === 1) await redis.expire(attemptsKey, 600);

    if (attempts > 5) {
      await redis.del(`moneyva:contact-otp:code:${emailKey}`);
      return NextResponse.json(
        { error: "Too many incorrect codes. Request a new code later." },
        { status: 429 },
      );
    }

    const otpKey = `moneyva:contact-otp:code:${emailKey}`;
    const submittedHash = hash(code);

    // Compare and consume the OTP atomically to prevent concurrent reuse.
    const otpAccepted = await redis.eval<[string], number>(
      "local stored = redis.call('GET', KEYS[1]); if stored == ARGV[1] then redis.call('DEL', KEYS[1]); return 1 end; return 0",
      [otpKey],
      [submittedHash],
    );

    if (Number(otpAccepted) !== 1) {
      return NextResponse.json(
        { error: "Incorrect or expired code." },
        { status: 400 },
      );
    }

    const verificationToken = randomBytes(32).toString("base64url");
    await redis.set(
      `moneyva:contact:verified:${hash(verificationToken)}`,
      email,
      { ex: 600 },
    );

    await redis.del(otpKey, attemptsKey);

    return NextResponse.json({
      success: true,
      verificationToken,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error(
      "Moneyva OTP service failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      { error: "Email verification is temporarily unavailable." },
      { status: 500 },
    );
  }
}
