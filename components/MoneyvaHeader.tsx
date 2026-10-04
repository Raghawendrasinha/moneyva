"use client";

import Link from "next/link";
import { usePreferences } from "./PreferencesProvider";

export default function MoneyvaHeader() {
  const {
    theme,
    language,
    toggleTheme,
    toggleLanguage,
  } = usePreferences();

  const isHindi = language === "hi";

  return (
    <header
      className={`
        sticky top-0 z-50 border-b backdrop-blur-xl
        ${
          theme === "dark"
            ? "border-white/10 bg-[#07111F]/95 text-white"
            : "border-slate-200 bg-white/95 text-slate-900"
        }
      `}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* ================================
            LOGO
        ================================= */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#07111F] shadow-lg shadow-emerald-500/20">
            <span className="text-2xl font-black leading-none">
              ₹
            </span>
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight">
              Moneyva
            </div>

            <div
              className={`
                hidden text-[10px] font-medium
                uppercase tracking-[0.2em] sm:block
                ${
                  theme === "dark"
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              {isHindi
                ? "आपका पैसा। आसान तरीके से।"
                : "Your Money. Simplified."}
            </div>
          </div>
        </Link>


        {/* ================================
            DESKTOP NAVIGATION
        ================================= */}

        <nav className="hidden items-center gap-6 md:flex">

          <Link
            href="/ctc-calculator"
            className={`
              text-sm font-medium transition
              ${
                theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }
            `}
          >
            {isHindi ? "सैलरी" : "Salary"}
          </Link>


          <Link
            href="/#calculators"
            className={`
              text-sm font-medium transition
              ${
                theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }
            `}
          >
            {isHindi ? "कैलकुलेटर" : "Calculators"}
          </Link>


          <Link
            href="/#how-it-works"
            className={`
              text-sm font-medium transition
              ${
                theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }
            `}
          >
            {isHindi
              ? "कैसे काम करता है"
              : "How It Works"}
          </Link>


          {/* THEME BUTTON */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isHindi
                ? "थीम बदलें"
                : "Change theme"
            }
            className={`
              flex h-10 w-10 items-center justify-center
              rounded-xl border transition
              ${
                theme === "dark"
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }
            `}
          >
            {theme === "dark" ? (
              <span className="text-lg">
                ☀️
              </span>
            ) : (
              <span className="text-lg">
                🌙
              </span>
            )}
          </button>


          {/* LANGUAGE BUTTON */}

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={
              isHindi
                ? "अंग्रेज़ी में बदलें"
                : "Switch to Hindi"
            }
            className={`
              rounded-xl border px-3 py-2 text-sm
              font-bold transition
              ${
                theme === "dark"
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }
            `}
          >
            {isHindi ? "EN" : "हिंदी"}
          </button>


          {/* CALCULATOR CTA */}

          <Link
            href="/ctc-calculator"
            className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#07111F] transition hover:bg-emerald-300"
          >
            {isHindi
              ? "सैलरी कैलकुलेट करें"
              : "Calculate Salary"}
          </Link>

        </nav>


        {/* ================================
            MOBILE CONTROLS
        ================================= */}

        <div className="flex items-center gap-2 md:hidden">

          <button
            type="button"
            onClick={toggleTheme}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-lg border
              ${
                theme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-slate-50"
              }
            `}
          >
            {theme === "dark"
              ? "☀️"
              : "🌙"}
          </button>


          <button
            type="button"
            onClick={toggleLanguage}
            className={`
              rounded-lg border px-2.5 py-2
              text-xs font-bold
              ${
                theme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-slate-50"
              }
            `}
          >
            {isHindi ? "EN" : "हिंदी"}
          </button>

        </div>

      </div>
    </header>
  );
}
