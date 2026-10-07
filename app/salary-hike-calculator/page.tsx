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
        
        <section className="mt-16 border-t border-slate-200 pt-12 dark:border-white/10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              SALARY HIKE GUIDE
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Understanding Salary Hikes and New CTC
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              A salary hike is the increase in your annual compensation compared
              with your current CTC. For example, if your current CTC is ₹10 lakh
              and your new CTC is ₹12 lakh, your annual increase is ₹2 lakh and
              your salary hike is 20%.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold">
              How Is Salary Hike Percentage Calculated?
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Salary hike percentage shows how much your CTC has increased
              compared with your previous CTC. The basic formula is:
            </p>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                Hike % = ((New CTC − Current CTC) ÷ Current CTC) × 100
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">Current CTC</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Your existing annual Cost to Company before the salary hike.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">Hike Percentage</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The percentage increase in your annual CTC compared with your
                current compensation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">Annual Increase</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The additional amount added to your annual CTC after the hike.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">New CTC</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Your revised annual CTC after applying the salary increase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">Monthly Increase</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The approximate increase in monthly CTC based on the annual
                increase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h3 className="font-bold">New Monthly CTC</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Your revised monthly CTC after the salary hike.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold">
              Salary Hike Example
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Suppose your current CTC is ₹10 lakh per year and your new CTC is
              ₹12 lakh. The annual increase is ₹2 lakh, which represents a 20%
              salary hike.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current CTC
                </p>
                <p className="mt-1 text-xl font-black">₹10,00,000</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Salary Hike
                </p>
                <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                  20%
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  New CTC
                </p>
                <p className="mt-1 text-xl font-black">₹12,00,000</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold">
              How to Use the Moneyva Salary Hike Calculator
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="font-bold">1. Enter your current CTC</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Enter your existing annual CTC to start the calculation.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="font-bold">2. Choose your calculation method</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Enter either your expected new CTC or your expected hike
                  percentage.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="font-bold">3. Check your salary increase</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Moneyva calculates your hike percentage, annual increase and
                  revised CTC.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="font-bold">4. Compare monthly amounts</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Review your current monthly CTC, new monthly CTC and monthly
                  increase.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <h3 className="text-lg font-bold">
              Want to estimate your actual take-home salary?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Your CTC is not the same as your monthly in-hand salary. Use the
              Moneyva CTC to In-Hand Salary Calculator to estimate your monthly
              take-home pay after common salary components and deductions.
            </p>

            <Link
              href="/ctc-calculator"
              className="mt-4 inline-block text-sm font-bold text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300"
            >
              Calculate In-Hand Salary →
            </Link>
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-10 dark:border-white/10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              सैलरी हाइक गाइड
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              सैलरी हाइक और नई CTC को समझें
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              सैलरी हाइक आपकी वर्तमान CTC की तुलना में आपकी वार्षिक CTC में
              होने वाली बढ़ोतरी है। उदाहरण के लिए, अगर आपकी वर्तमान CTC ₹10 लाख
              और नई CTC ₹12 लाख है, तो वार्षिक बढ़ोतरी ₹2 लाख और सैलरी हाइक 20%
              होगी।
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold">
              सैलरी हाइक प्रतिशत कैसे निकाला जाता है?
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              सैलरी हाइक प्रतिशत आपकी नई CTC में आपकी वर्तमान CTC की तुलना में
              हुई बढ़ोतरी को दर्शाता है।
            </p>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                हाइक % = ((नई CTC − वर्तमान CTC) ÷ वर्तमान CTC) × 100
              </p>
            </div>
          </div>
        </section>
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
