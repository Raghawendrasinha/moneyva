"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

export default function NotFound() {
  const { theme, language } = usePreferences();
  const isHindi = language === "hi";

  return (
    <main className={`relative flex min-h-[75vh] items-center justify-center overflow-hidden px-5 py-16 ${
      theme === "dark"
        ? "bg-[#07111F] text-white"
        : "bg-slate-50 text-slate-900"
    }`}>
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-3xl font-black text-[#07111F] shadow-lg shadow-emerald-500/20">
          ₹
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
          MONEYVA
        </p>
        <h1 className="mt-3 text-7xl font-black tracking-tight sm:text-8xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
          {isHindi ? "यह पेज नहीं मिला" : "Page Not Found"}
        </h2>
        <p className={`mt-4 leading-7 ${
          theme === "dark" ? "text-slate-300" : "text-slate-600"
        }`}>
          {isHindi
            ? "माफ़ कीजिए, यह पेज उपलब्ध नहीं है या इसका पता बदल गया है।"
            : "Sorry, this page isn't available or may have moved."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 font-bold text-[#07111F] transition hover:bg-emerald-300"
        >
          {isHindi ? "होम पेज पर जाएँ" : "Back to Home"}
        </Link>
      </section>
    </main>
  );
}
