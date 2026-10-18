import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(
    cookieStore.get(ADMIN_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { error: "Please log in to access tickets." },
      { status: 401 }
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

  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      "id,ticket_number,name,email,message,status,resolution,created_at,status_updated_at,resolution_email_status,resolution_email_sent_at"
    )
    .not("ticket_number", "is", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Admin ticket listing failed:", error.code);
    return NextResponse.json(
      { error: "Unable to load tickets." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ tickets: data ?? [] });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
