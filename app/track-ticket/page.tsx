import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track Your Moneyva Ticket",
  description: "Check the status of your Moneyva support ticket.",
  robots: { index: false, follow: false },
};

type TicketPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default async function TrackTicketPage({
  searchParams,
}: TicketPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  let ticket: {
    ticket_number: string;
    status: string;
    message: string;
    resolution: string | null;
    created_at: string | null;
    status_updated_at: string | null;
  } | null = null;

  let unavailable = false;

  if (token && /^[A-Za-z0-9_-]{40,50}$/.test(token)) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecret) {
      unavailable = true;
    } else {
      try {
        const supabase = createClient(supabaseUrl, supabaseSecret, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        });

        const tokenHash = createHash("sha256").update(token).digest("hex");

        const { data, error } = await supabase
          .from("contact_messages")
          .select(
            "ticket_number,status,message,resolution,created_at,status_updated_at"
          )
          .eq("tracking_token_hash", tokenHash)
          .maybeSingle();

        if (error) {
          unavailable = true;
        } else if (data?.ticket_number) {
          ticket = data;
        }
      } catch {
        unavailable = true;
      }
    }
  }

  return (
    <main className="min-h-[65vh] bg-slate-50 px-5 py-12 text-slate-900 dark:bg-[#07111F] dark:text-white sm:py-16">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          MONEYVA SUPPORT
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          Track Your Ticket
        </h1>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          View your submitted message, ticket status, and any resolution
          provided by Moneyva.
        </p>

        {ticket ? (
          <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Ticket Number
              </p>
              <p className="mt-2 break-all text-2xl font-extrabold">
                {ticket.ticket_number}
              </p>

              <div className="mt-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Current Status
                </p>
                <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {ticket.status}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ticket Created
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(ticket.created_at)}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last Status or Resolution Update
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(ticket.status_updated_at)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <h2 className="text-xl font-bold">Your Original Message</h2>
              <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-slate-200">
                {ticket.message}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-500/30 dark:bg-white/[0.03]">
              <h2 className="text-xl font-bold">Moneyva&apos;s Resolution / Reply</h2>

              {ticket.resolution?.trim() ? (
                <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-slate-200">
                  {ticket.resolution}
                </p>
              ) : (
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  Our team is reviewing your request. The resolution or next
                  update will appear here when it is added.
                </p>
              )}
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Please keep your ticket number for future reference. If you need
              further assistance, reply to the latest email from Moneyva.
            </p>
          </section>
        ) : (
          <section
            role="status"
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
          >
            <h2 className="text-xl font-bold">
              {unavailable
                ? "Tracking is temporarily unavailable"
                : "Ticket link invalid or unavailable"}
            </h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              {unavailable
                ? "We could not retrieve your ticket right now. Please try again later."
                : "Open the complete tracking link from your Moneyva acknowledgement email. If the problem continues, contact our support team."}
            </p>
          </section>
        )}
      </section>
    </main>
  );
}
