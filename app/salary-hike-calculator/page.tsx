"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";
import { translations } from "@/lib/i18n/translations";

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

type CalculationMode = "newCtc" | "percentage";

export default function SalaryHikeCalculator() {
  const { language } = usePreferences();
  const t = translations[language].salaryHike;

  const [currentCtc, setCurrentCtc] = useState(0);
  const [newCtc, setNewCtc] = useState(0);
  const [hikePercentageInput, setHikePercentageInput] = useState(0);
  const [mode, setMode] = useState<CalculationMode>("newCtc");

  const result = useMemo(() => {
    if (currentCtc <= 0) {
      return {
        increase: 0,
        hikePercentage: 0,
        calculatedNewCtc: 0,
        currentMonthly: 0,
        newMonthly: 0,
        monthlyIncrease: 0,
      };
    }

    if (mode === "percentage") {
      const hikePercentage = Math.max(0, hikePercentageInput);
      const increase = (currentCtc * hikePercentage) / 100;
      const calculatedNewCtc = currentCtc + increase;

      return {
        increase,
        hikePercentage,
        calculatedNewCtc,
        currentMonthly: currentCtc / 12,
        newMonthly: calculatedNewCtc / 12,
        monthlyIncrease: increase / 12,
      };
    }

    const increase = Math.max(0, newCtc - currentCtc);
    const hikePercentage = (increase / currentCtc) * 100;

    return {
      increase,
      hikePercentage,
      calculatedNewCtc: newCtc,
      currentMonthly: currentCtc / 12,
      newMonthly: newCtc / 12,
      monthlyIncrease: increase / 12,
    };
  }, [currentCtc, newCtc, hikePercentageInput, mode]);

  function handleNumberChange(
    value: string,
    setter: (value: number) => void,
  ) {
    if (value === "") {
      setter(0);
      return;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      setter(0);
      return;
    }

    setter(Math.max(0, parsed));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111F] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t.calculatorLabel}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            {t.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* INPUT CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#102131]">
            <h2 className="text-xl font-bold">{t.enterSalaryDetails}</h2>

            {/* CURRENT CTC */}

            <div className="mt-6">
              <label className="text-sm font-medium">
                {t.currentAnnualCtc}
              </label>

              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={currentCtc === 0 ? "" : currentCtc}
                  placeholder="0"
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setCurrentCtc)
                  }
                  className="
                    w-full rounded-lg border border-slate-300 bg-white
                    py-3 pl-10 pr-4 text-slate-900 outline-none transition
                    placeholder:text-slate-400 focus:border-emerald-500
                    focus:ring-1 focus:ring-emerald-500
                    dark:border-white/10 dark:bg-[#07111F]
                    dark:text-white dark:placeholder:text-slate-600
                  "
                />
              </div>

              {currentCtc > 0 && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(currentCtc)}
                </p>
              )}
            </div>

            {/* MODE */}

            <div className="mt-7">
              <p className="text-sm font-medium">{t.calculateUsing}</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("newCtc")}
                  className={`rounded-xl border p-4 text-left transition ${
                    mode === "newCtc"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20"
                  }`}
                >
                  <p className="font-bold">{t.newCtcOption}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.newCtcOptionDescription}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("percentage")}
                  className={`rounded-xl border p-4 text-left transition ${
                    mode === "percentage"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20"
                  }`}
                >
                  <p className="font-bold">{t.percentageOption}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.percentageOptionDescription}
                  </p>
                </button>
              </div>
            </div>

            {/* NEW CTC MODE */}

            {mode === "newCtc" && (
              <div className="mt-6">
                <label className="text-sm font-medium">
                  {t.newAnnualCtc}
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={newCtc === 0 ? "" : newCtc}
                    placeholder="0"
                    onChange={(e) =>
                      handleNumberChange(e.target.value, setNewCtc)
                    }
                    className="
                      w-full rounded-lg border border-slate-300 bg-white
                      py-3 pl-10 pr-4 text-slate-900 outline-none transition
                      placeholder:text-slate-400 focus:border-emerald-500
                      focus:ring-1 focus:ring-emerald-500
                      dark:border-white/10 dark:bg-[#07111F]
                      dark:text-white dark:placeholder:text-slate-600
                    "
                  />
                </div>

                {newCtc > 0 && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatCurrency(newCtc)}
                  </p>
                )}
              </div>
            )}

            {/* PERCENTAGE MODE */}

            {mode === "percentage" && (
              <div className="mt-6">
                <label className="text-sm font-medium">
                  {t.expectedHikePercentage}
                </label>

                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={
                      hikePercentageInput === 0
                        ? ""
                        : hikePercentageInput
                    }
                    placeholder="0"
                    onChange={(e) =>
                      handleNumberChange(
                        e.target.value,
                        setHikePercentageInput,
                      )
                    }
                    className="
                      w-full rounded-lg border border-slate-300 bg-white
                      py-3 pl-4 pr-12 text-slate-900 outline-none transition
                      placeholder:text-slate-400 focus:border-emerald-500
                      focus:ring-1 focus:ring-emerald-500
                      dark:border-white/10 dark:bg-[#07111F]
                      dark:text-white dark:placeholder:text-slate-600
                    "
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    %
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.salaryHint}
              </p>
            </div>
          </div>

          {/* RESULT CARD */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-[#102131]">
            <h2 className="text-xl font-bold">{t.resultTitle}</h2>

            <div className="mt-6 rounded-xl bg-emerald-50 p-5 dark:bg-emerald-500/10">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.hikePercentage}
              </p>

              <p className="mt-1 text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {result.hikePercentage.toFixed(2)}%
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultItem
                label={t.annualIncrease}
                value={formatCurrency(result.increase)}
              />

              <ResultItem
                label={t.currentMonthlyCtc}
                value={formatCurrency(result.currentMonthly)}
              />

              <ResultItem
                label={t.newMonthlyCtc}
                value={formatCurrency(result.calculatedNewCtc / 12)}
              />

              <ResultItem
                label={t.monthlyIncrease}
                value={formatCurrency(result.monthlyIncrease)}
              />
            </div>

            {mode === "percentage" && result.calculatedNewCtc > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.calculatedNewCtc}
                </p>

                <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.calculatedNewCtc)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ctc-calculator"
            className="text-sm font-bold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
          >
            {t.calculateInHand} →
          </Link>
        </div>
      </section>
    </main>
  );
}

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
