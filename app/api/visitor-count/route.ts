
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const redis = Redis.fromEnv();

    // Atomic increment shared across all visitors and deployments.
    const count = await redis.incr("moneyva:total-page-views");

    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Visitor counter failed:", error);

    return NextResponse.json(
      { error: "Visitor count unavailable" },
      { status: 503 },
    );
  }
}
