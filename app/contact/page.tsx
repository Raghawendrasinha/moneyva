"use client";

import { useState, type FormEvent } from "react";
import { usePreferences } from "@/components/PreferencesProvider";

export default function ContactPage() {
  const { language } = usePreferences();
  const hi = language === "hi";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpStatus, setOtpStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [acknowledgementEmailSent, setAcknowledgementEmailSent] = useState(true);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function changeEmail(value: string) {
    setEmail(value);
    setOtpSent(false);
    setOtp("");
    setVerificationToken("");
    setOtpStatus(null);
  }

  async function requestOtp() {
    setOtpBusy(true);
    setOtpStatus(null);

    try {
      const response = await fetch("/api/contact-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: email.trim().toLowerCase(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (hi ? "OTP भेजा नहीं जा सका।" : "Could not send the verification code."),
        );
      }

      setOtpSent(true);
      setOtp("");
      setVerificationToken("");
      setOtpStatus({
        type: "success",
        text: hi
          ? "OTP आपके ईमेल पर भेज दिया गया है। यह 10 मिनट में समाप्त हो जाएगा।"
          : "A verification code was sent to your email. It expires in 10 minutes.",
      });
    } catch (error) {
      setOtpStatus({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : hi
              ? "कुछ गलत हुआ। दोबारा प्रयास करें।"
              : "Something went wrong. Please try again.",
      });
    } finally {
      setOtpBusy(false);
    }
  }

  async function verifyOtp() {
    setOtpBusy(true);
    setOtpStatus(null);

    try {
      const response = await fetch("/api/contact-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: email.trim().toLowerCase(),
          code: otp.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (hi ? "OTP सही नहीं है।" : "The verification code is incorrect."),
        );
      }

      if (
        typeof result.verificationToken !== "string" ||
        !result.verificationToken
      ) {
        throw new Error(
          hi
            ? "सत्यापन टोकन नहीं मिला। कृपया दोबारा प्रयास करें।"
            : "Verification token was not returned. Please try again.",
        );
      }

      setVerificationToken(result.verificationToken);
      setOtpStatus({
        type: "success",
        text: hi
          ? "ईमेल सफलतापूर्वक सत्यापित हो गया।"
          : "Email verified successfully.",
      });
    } catch (error) {
      setVerificationToken("");
      setOtpStatus({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : hi
              ? "OTP सत्यापित नहीं हो सका।"
              : "Could not verify the code.",
      });
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!verificationToken) {
      setStatus({
        type: "error",
        text: hi
          ? "संदेश भेजने से पहले अपना ईमेल सत्यापित करें।"
          : "Please verify your email before submitting the message.",
      });
      return;
    }

    setBusy(true);
    setStatus(null);
    setTicketNumber(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          message,
          website,
          verificationToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (hi
              ? "संदेश भेजा नहीं जा सका। दोबारा प्रयास करें।"
              : "Unable to send your message."),
        );
      }

      if (typeof result.ticketNumber !== "string" || !result.ticketNumber) {
        throw new Error(
          hi
            ? "जवाब प्राप्त हुआ, लेकिन टिकट नंबर नहीं मिला। कृपया हमसे संपर्क करें।"
            : "We received a response but could not retrieve your ticket number. Please contact us.",
        );
      }

      setTicketNumber(result.ticketNumber);
      setAcknowledgementEmailSent(result.acknowledgementEmailSent !== false);
      setStatus({
        type: "success",
        text: hi
          ? "धन्यवाद! आपका अनुरोध दर्ज कर लिया गया है। हम 3 कार्यदिवसों के भीतर जवाब देने का प्रयास करेंगे।"
          : "Thank you! Your request has been registered. We aim to respond within 3 working days.",
      });

      setName("");
      changeEmail("");
      setMessage("");
      setWebsite("");
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : hi
              ? "कुछ गलत हुआ। कृपया दोबारा प्रयास करें।"
              : "Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white";

  return (
    <main className="min-h-[65vh] bg-slate-50 px-5 py-12 text-slate-900 dark:bg-[#07111F] dark:text-white sm:py-16">
      <section className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          {hi ? "हमसे संपर्क करें" : "GET IN TOUCH"}
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          {hi ? "संपर्क करें" : "Contact Us"}
        </h1>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          {hi
            ? "कोई सवाल, सुझाव या समस्या है? नीचे फॉर्म भरें।"
            : "Have a question, suggestion or issue? Fill out the form below and send us a message."}
        </p>

        <div className="mt-6">
          <a
            href="/ticket-status"
            className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-600 px-5 py-3 font-bold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
          >
            {hi ? "टिकट का स्टेटस चेक करें" : "Check Ticket Status"}
          </a>
        </div>

        {ticketNumber && (
          <section
            aria-live="polite"
            className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          >
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              {hi ? "आपका टिकट नंबर" : "Your Ticket Number"}
            </p>
            <p className="mt-2 break-all text-2xl font-extrabold tracking-wide text-slate-900 dark:text-white">
              {ticketNumber}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {hi
                ? "कृपया इस नंबर को भविष्य के संदर्भ के लिए सुरक्षित रखें।"
                : "Please save this number for future reference."}
            </p>
            {!acknowledgementEmailSent && (
              <p className="mt-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
                {hi
                  ? "आपका टिकट दर्ज हो गया है, लेकिन पुष्टि वाला ईमेल नहीं भेजा जा सका। कृपया टिकट नंबर सुरक्षित रखें।"
                  : "Your ticket is registered, but we could not send the acknowledgement email. Please save your ticket number."}
              </p>
            )}
          </section>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-8"
        >
          <div>
            <label htmlFor="contact-name" className="text-sm font-semibold">
              {hi ? "आपका नाम" : "Name"} *
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              className={inputClass}
              placeholder={hi ? "अपना नाम लिखें" : "Enter your name"}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="text-sm font-semibold">
              {hi ? "ईमेल पता" : "Email address"} *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => changeEmail(event.target.value)}
              maxLength={254}
              required
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={requestOtp}
                disabled={
                  otpBusy ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
                  Boolean(verificationToken)
                }
                className="rounded-xl border border-emerald-600 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
              >
                {otpBusy
                  ? hi
                    ? "कृपया प्रतीक्षा करें..."
                    : "Please wait..."
                  : verificationToken
                    ? hi
                      ? "ईमेल सत्यापित ✓"
                      : "Email verified ✓"
                    : otpSent
                      ? hi
                        ? "OTP दोबारा भेजें"
                        : "Resend OTP"
                      : hi
                        ? "OTP भेजें"
                        : "Send OTP"}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {hi
                  ? "ईमेल सत्यापन आवश्यक है।"
                  : "Email verification is required."}
              </span>
            </div>

            {otpSent && !verificationToken && (
              <div className="mt-4">
                <label htmlFor="contact-otp" className="text-sm font-semibold">
                  {hi ? "6 अंकों का OTP" : "6-digit verification code"}
                </label>
                <input
                  id="contact-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className={inputClass}
                  placeholder={hi ? "6 अंकों का OTP दर्ज करें" : "Enter your 6-digit code"}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otpBusy || otp.length !== 6}
                  className="mt-3 w-full rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {otpBusy
                    ? hi
                      ? "सत्यापित हो रहा है..."
                      : "Verifying..."
                    : hi
                      ? "OTP सत्यापित करें"
                      : "Verify OTP"}
                </button>
              </div>
            )}

            {otpStatus && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-3 rounded-xl p-3 text-sm leading-6 ${
                  otpStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                    : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200"
                }`}
              >
                {otpStatus.text}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="text-sm font-semibold">
              {hi ? "संदेश / सवाल" : "Message / Query"} *
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={inputClass}
              placeholder={
                hi
                  ? "बताएँ कि हम आपकी कैसे मदद कर सकते हैं..."
                  : "Tell us how we can help..."
              }
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              minLength={10}
              maxLength={5000}
              rows={6}
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {hi ? "कम से कम 10 अक्षर लिखें।" : "Please enter at least 10 characters."}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          {status && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-xl p-4 text-sm leading-6 ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200"
              }`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !verificationToken}
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-[#07111F] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy
              ? hi
                ? "भेजा जा रहा है..."
                : "Sending..."
              : hi
                ? "सत्यापित ईमेल से संदेश भेजें"
                : "Submit Verified Message"}
          </button>

          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {hi
              ? "फॉर्म भेजकर आप इस अनुरोध को संभालने के लिए अपनी जानकारी के उपयोग से सहमत हैं।"
              : "By submitting this form, you agree to the use of your information to handle this enquiry."}
          </p>
        </form>
      </section>
    </main>
  );
}
