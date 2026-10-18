"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { usePreferences } from "@/components/PreferencesProvider";

type Ticket = {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  message: string;
  status: string;
  resolution: string | null;
  created_at: string | null;
  status_updated_at: string | null;
  resolution_email_status: string | null;
  resolution_email_sent_at: string | null;
};

function t(en: string, hi: string, isHindi: boolean) {
  return isHindi ? hi : en;
}

function statusLabel(status: string, isHindi: boolean) {
  const labels: Record<string, string> = {
    "Open": "खुला",
    "In Progress": "प्रगति में",
    "Awaiting Your Reply": "आपके जवाब की प्रतीक्षा",
    "Resolved": "समाधान किया गया",
    "Closed": "बंद",
    "All": "सभी",
  };
  return isHindi ? (labels[status] ?? status) : status;
}

const STATUSES = [
  "Open",
  "In Progress",
  "Awaiting Your Reply",
  "Resolved",
  "Closed",
];

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export default function AdminPage() {
  const { language } = usePreferences();
  const isHindi = language === "hi";
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("Open");
  const [resolution, setResolution] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");

  const loadTickets = useCallback(async () => {
    const response = await fetch("/api/admin/tickets", {
      cache: "no-store",
    });

    if (response.status === 401) {
      setLoggedIn(false);
      return false;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to load tickets.");
    }

    const rows = Array.isArray(result.tickets)
      ? (result.tickets as Ticket[])
      : [];

    setTickets(rows);
    setLoggedIn(true);
    setSelectedId((current) =>
      rows.some((ticket) => ticket.id === current)
        ? current
        : rows[0]?.id ?? ""
    );

    return true;
  }, []);

  useEffect(() => {
    let active = true;

    async function initialise() {
      try {
        const response = await fetch("/api/admin/tickets", {
          cache: "no-store",
        });

        if (!active) return;

        if (response.status === 401) {
          setLoggedIn(false);
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load tickets.");
        }

        const rows = Array.isArray(result.tickets)
          ? (result.tickets as Ticket[])
          : [];

        setTickets(rows);
        setLoggedIn(true);
        setSelectedId(rows[0]?.id ?? "");
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load tickets."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialise();

    return () => {
      active = false;
    };
  }, []);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId);

  useEffect(() => {
    if (!selectedTicket) return;
    setStatus(selectedTicket.status);
    setResolution(selectedTicket.resolution ?? "");
  }, [selectedTicket]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      setPassword("");
      await loadTickets();
      setNotice("You are now logged in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }

  async function handleSave(sendResolutionEmail: boolean) {
    if (!selectedTicket) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/tickets/${encodeURIComponent(selectedTicket.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            resolution,
            sendResolutionEmail,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        setLoggedIn(false);
        throw new Error("Your session expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(result.error || "Unable to save ticket.");
      }

      await loadTickets();

      if (sendResolutionEmail) {
        setNotice(
          result.emailSent
            ? "Ticket saved and resolution email sent successfully."
            : "Ticket saved, but the resolution email could not be sent. Check the email configuration and logs before retrying."
        );
      } else {
        setNotice("Ticket changes saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save ticket.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to log out. Please try again.");
      }

      setLoggedIn(false);
      setTickets([]);
      setSelectedId("");
      setPassword("");
      setUsername("");
      setNotice("You have been logged out.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed.");
    } finally {
      setBusy(false);
    }
  }

  const visibleTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-slate-900 dark:text-white";

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 text-slate-900 dark:bg-[#07111F] dark:text-white sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              MONEYVA SUPPORT
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">
              {loggedIn ? t("Ticket Dashboard", "टिकट डैशबोर्ड", isHindi) : t("Admin Login", "एडमिन लॉगिन", isHindi)}
            </h1>
          </div>

          {loggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
            >
              {t("Log out", "लॉग आउट", isHindi)}
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-200"
          >
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
          >
            {notice}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-slate-600 dark:text-slate-300">
            {t("Checking your session…", "आपका सेशन जाँचा जा रहा है…", isHindi)}
          </p>
        ) : !loggedIn ? (
          <form
            onSubmit={handleLogin}
            className="mt-8 max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-8"
          >
            <div>
              <label htmlFor="admin-username" className="text-sm font-semibold">
                {t("Username", "यूज़रनेम", isHindi)}
              </label>
              <input
                id="admin-username"
                autoComplete="username"
                className={inputClass}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="text-sm font-semibold">
                {t("Password", "पासवर्ड", isHindi)}
              </label>
              <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                maxLength={256}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800"
                aria-label={showPassword ? t("Hide password", "पासवर्ड छिपाएँ", isHindi) : t("Show password", "पासवर्ड दिखाएँ", isHindi)}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A11.5 11.5 0 0112 5c5 0 8.3 4.1 9.5 7-.5 1.2-1.3 2.4-2.4 3.4" />
                    <path d="M6.2 6.2C3.8 7.7 2.7 9.8 2.5 12c1.2 2.9 4.5 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-[#07111F] hover:bg-emerald-300 disabled:opacity-60"
            >
              {busy ? t("Signing in…", "लॉगिन हो रहा है…", isHindi) : t("Sign in", "लॉगिन करें", isHindi)}
            </button>
          </form>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">{t("Tickets", "टिकट", isHindi)} ({tickets.length})</h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setError("");
                    try {
                      await loadTickets();
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Unable to refresh tickets."
                      );
                    }
                  }}
                  className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {t("Refresh", "रिफ्रेश करें", isHindi)}
                </button>
              </div>

              <label htmlFor="ticket-filter" className="mt-4 block text-sm">
                {t("Filter by status", "स्टेटस के अनुसार फ़िल्टर", isHindi)}
              </label>
              <select
                id="ticket-filter"
                className={inputClass}
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="All">{statusLabel("All", isHindi)}</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>{statusLabel(item, isHindi)}</option>
                ))}
              </select>

              <div className="mt-4 max-h-[650px] space-y-2 overflow-y-auto">
                {visibleTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(ticket.id);
                      setError("");
                      setNotice("");
                    }}
                    className={`w-full rounded-xl border p-3 text-left ${
                      selectedId === ticket.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="block break-all text-sm font-bold">
                      {ticket.ticket_number}
                    </span>
                    <span className="mt-1 block truncate text-sm">
                      {ticket.name}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      {statusLabel(ticket.status, isHindi)} · {formatDate(ticket.created_at)}
                    </span>
                  </button>
                ))}

                {visibleTickets.length === 0 && (
                  <p className="py-6 text-sm text-slate-500 dark:text-slate-400">
                    {t("No tickets found for this filter.", "इस फ़िल्टर के लिए कोई टिकट नहीं मिला।", isHindi)}
                  </p>
                )}
              </div>
            </aside>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-7">
              {selectedTicket ? (
                <>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t("Ticket", "टिकट", isHindi)}
                  </p>
                  <h2 className="mt-1 break-all text-2xl font-extrabold">
                    {selectedTicket.ticket_number}
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("Customer", "ग्राहक", isHindi)}
                      </p>
                      <p className="mt-1 break-words font-semibold">
                        {selectedTicket.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("Email", "ईमेल", isHindi)}
                      </p>
                      <p className="mt-1 break-all font-semibold">
                        {selectedTicket.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("Created", "बनाया गया", isHindi)}
                      </p>
                      <p className="mt-1 text-sm">
                        {formatDate(selectedTicket.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("Last status update", "स्टेटस में आख़िरी बदलाव", isHindi)}
                      </p>
                      <p className="mt-1 text-sm">
                        {formatDate(selectedTicket.status_updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold">{t("Original complaint / query", "मूल शिकायत / सवाल", isHindi)}</h3>
                    <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 dark:bg-white/5">
                      {selectedTicket.message}
                    </p>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="ticket-status" className="font-bold">
                      {t("Ticket status", "टिकट का स्टेटस", isHindi)}
                    </label>
                    <select
                      id="ticket-status"
                      className={inputClass}
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      {STATUSES.map((item) => (
                        <option key={item} value={item}>{statusLabel(item, isHindi)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="ticket-resolution" className="font-bold">
                      {t("Resolution / reply to customer", "समाधान / ग्राहक को जवाब", isHindi)}
                    </label>
                    <textarea
                      id="ticket-resolution"
                      className={inputClass}
                      value={resolution}
                      onChange={(event) => setResolution(event.target.value)}
                      maxLength={10000}
                      rows={8}
                      placeholder={t("Explain the solution or provide an update for the customer…", "समाधान समझाएँ या ग्राहक के लिए अपडेट लिखें…", isHindi)}
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {t("This text will appear on the secure tracking page once we update it, and in the resolution email when you send one.", "यह टेक्स्ट टिकट अपडेट करने के बाद सुरक्षित ट्रैकिंग पेज पर और समाधान ईमेल में दिखाई देगा।", isHindi)}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-white/5">
                    <p>
                      <strong>{t("Last resolution email:", "आख़िरी समाधान ईमेल:", isHindi)}</strong>{" "}
                      {selectedTicket.resolution_email_status ?? "pending"}
                    </p>
                    <p className="mt-1">
                      <strong>{t("Sent at:", "भेजने का समय:", isHindi)}</strong>{" "}
                      {formatDate(selectedTicket.resolution_email_sent_at)}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleSave(false)}
                      className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-bold hover:bg-slate-50 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
                    >
                      {busy ? t("Saving…", "सेव हो रहा है…", isHindi) : t("Save Changes", "बदलाव सेव करें", isHindi)}
                    </button>
                    <button
                      type="button"
                      disabled={busy || !resolution.trim()}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Send the current status and resolution for ${selectedTicket.ticket_number} to ${selectedTicket.email}?`
                          )
                        ) {
                          void handleSave(true);
                        }
                      }}
                      className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-[#07111F] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy ? t("Please wait…", "कृपया प्रतीक्षा करें…", isHindi) : t("Save & Send Resolution Email", "सेव करें और समाधान ईमेल भेजें", isHindi)}
                    </button>
                  </div>
                </>
              ) : (
                <p className="py-10 text-slate-500 dark:text-slate-400">
                  {tickets.length
                    ? t("Select a ticket to view and manage it.", "विवरण देखने और प्रबंधित करने के लिए टिकट चुनें।", isHindi)
                    : t("No tickets have been registered yet.", "अभी तक कोई टिकट दर्ज नहीं किया गया है।", isHindi)}
                </p>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
