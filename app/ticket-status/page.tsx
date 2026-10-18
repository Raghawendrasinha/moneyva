"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

type TicketResult = {
  ticketNumber: string;
  status: string;
  updatedAt: string;
};

const translations = {
  en: {
    support: "MONEYVA SUPPORT",
    title: "Check Ticket Status",
    description:
      "Enter your ticket number and the email address you used when submitting your enquiry.",
    ticketNumber: "Ticket Number",
    ticketPlaceholder: "MV-20261018-A1B2C3",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    checking: "Checking...",
    checkStatus: "Check Status",
    currentStatus: "Current Status",
    lastUpdated: "Last Updated",
    notAvailable: "Not available",
    newEnquiry: "Need to submit a new enquiry?",
    contact: "Contact Moneyva",
    unable: "Unable to check ticket status.",
    somethingWrong: "Something went wrong. Please try again.",
    statuses: {
      Open: "Open",
      "In Progress": "In Progress",
      "Awaiting Your Reply": "Awaiting Your Reply",
      Resolved: "Resolved",
      Closed: "Closed",
    } as Record<string, string>,
  },
  hi: {
    support: "मनीवा सहायता",
    title: "टिकट का स्टेटस देखें",
    description:
      "अपना टिकट नंबर और वह ईमेल पता दर्ज करें जिसका उपयोग आपने अपनी पूछताछ भेजते समय किया था।",
    ticketNumber: "टिकट नंबर",
    ticketPlaceholder: "MV-20261018-A1B2C3",
    email: "ईमेल पता",
    emailPlaceholder: "you@example.com",
    checking: "जाँच हो रही है...",
    checkStatus: "स्टेटस देखें",
    currentStatus: "वर्तमान स्थिति",
    lastUpdated: "अंतिम अपडेट",
    notAvailable: "उपलब्ध नहीं",
    newEnquiry: "क्या आप नई पूछताछ भेजना चाहते हैं?",
    contact: "मनीवा से संपर्क करें",
    unable: "टिकट का स्टेटस जाँच नहीं हो सका।",
    somethingWrong: "कुछ गलत हो गया। कृपया फिर से कोशिश करें।",
    statuses: {
      Open: "खुला",
      "In Progress": "काम जारी है",
      "Awaiting Your Reply": "आपके जवाब का इंतज़ार",
      Resolved: "समाधान हो गया",
      Closed: "बंद",
    } as Record<string, string>,
  },
};

function formatDate(value: string, isHindi: boolean, notAvailable: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return notAvailable;

  return new Intl.DateTimeFormat(isHindi ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default function TicketStatusPage() {
  const { theme, language } = usePreferences();
  const isHindi = language === "hi";
  const t = isHindi ? translations.hi : translations.en;

  const [ticketNumber, setTicketNumber] = useState("");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState<TicketResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setTicket(null);

    try {
      const response = await fetch("/api/ticket-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t.unable);
      }

      setTicket(result as TicketResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.somethingWrong
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white";

  const statusClass: Record<string, string> = {
    Open: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
    "In Progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
    "Awaiting Your Reply":
      "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-200",
    Resolved:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    Closed:
      "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200",
  };

  return (
    <main className="min-h-[65vh] bg-slate-50 px-5 py-12 text-slate-900 dark:bg-[#07111F] dark:text-white sm:py-16">
      <section className="mx-auto max-w-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          {t.support}
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          {t.description}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-8"
        >
          <div>
            <label htmlFor="ticket-number" className="text-sm font-semibold">
              {t.ticketNumber}
            </label>
            <input
              id="ticket-number"
              name="ticketNumber"
              className={inputClass}
              placeholder={t.ticketPlaceholder}
              value={ticketNumber}
              onChange={(event) => setTicketNumber(event.target.value)}
              maxLength={24}
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label htmlFor="ticket-email" className="text-sm font-semibold">
              {t.email}
            </label>
            <input
              id="ticket-email"
              name="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-[#07111F] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? t.checking : t.checkStatus}
          </button>
        </form>

        {ticket && (
          <section
            aria-live="polite"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t.ticketNumber}
            </p>
            <p className="mt-1 break-all text-xl font-extrabold">
              {ticket.ticketNumber}
            </p>

            <div className="mt-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.currentStatus}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                  statusClass[ticket.status] ??
                  "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white"
                }`}
              >
                {t.statuses[ticket.status] ?? ticket.status}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.lastUpdated}
              </p>
              <p className="mt-1 font-medium">
                {formatDate(ticket.updatedAt, isHindi, t.notAvailable)}
              </p>
            </div>
          </section>
        )}

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          {t.newEnquiry}{" "}
          <Link
            href="/contact"
            className="font-semibold text-emerald-700 underline dark:text-emerald-300"
          >
            {t.contact}
          </Link>
        </p>
      </section>
    </main>
  );
}
