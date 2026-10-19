"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePreferences } from "@/components/PreferencesProvider";

type Language = "en" | "hi";

const content = {
  en: {
    label: "INVESTMENT CALCULATOR",
    title: "SIP Calculator",
    description:
      "Estimate how your monthly investments may grow over time, including an optional annual step-up.",
    inputsTitle: "Plan your investment",
    monthlyInvestment: "Monthly investment",
    annualReturn: "Expected annual return (%)",
    duration: "Investment duration (years)",
    stepUp: "Annual step-up",
    noStepUp: "No step-up",
    years: "years",
    invested: "Total amount invested",
    gains: "Estimated returns",
    futureValue: "Estimated future value",
    breakdown: "Investment breakdown",
    investedDescription: "Your contributions over the investment period",
    gainsDescription: "Potential growth based on your assumed return",
    futureDescription: "Contributions plus estimated returns",
    exampleTitle: "SIP investment example",
    exampleDescription:
      "For example, investing ₹5,000 per month for 10 years at an assumed 12% annual return, with no annual step-up, could grow to approximately ₹11.5 lakh. You would contribute ₹6 lakh, while the estimated returns would be around ₹5.5 lakh.",
    guideTitle: "How does a SIP calculator work?",
    guide:
      "A Systematic Investment Plan (SIP) lets you invest a fixed amount regularly. This calculator estimates the future value using an effective monthly return derived from your assumed annual return. Actual market returns vary and are not guaranteed.",
    formulaTitle: "Calculation method",
    formula:
      "Monthly rate = (1 + annual return)^(1/12) − 1. Monthly contributions are assumed to occur at the end of each month. With a step-up, the contribution increases at the beginning of each new investment year.",
    disclaimerTitle: "Important disclaimer",
    disclaimer:
      "This result is an illustration, not a guarantee or investment recommendation. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.",
    relatedTitle: "Explore More Calculators",
    relatedDescription: "Use these free tools to plan your salary and finances.",
    ctcCalculator: "CTC to In-Hand Salary Calculator",
    salaryHikeCalculator: "Salary Hike Calculator",
    home: "Home",
    invalidInvestment: "Enter a monthly investment above ₹0.",
    invalidReturn: "Enter an annual return between 0% and 20%.",
    invalidDuration: "Enter a whole number of years between 1 and 40.",
    invalidStepUp: "Select a valid annual step-up rate.",
  },
  hi: {
    label: "निवेश कैलकुलेटर",
    title: "SIP कैलकुलेटर",
    description:
      "अपने मासिक निवेश की संभावित वृद्धि का अनुमान लगाएं। चाहें तो हर साल निवेश बढ़ाने का विकल्प भी चुनें।",
    inputsTitle: "अपने निवेश की योजना बनाएं",
    monthlyInvestment: "मासिक निवेश",
    annualReturn: "अनुमानित वार्षिक रिटर्न (%)",
    duration: "निवेश की अवधि (वर्ष)",
    stepUp: "हर साल निवेश में बढ़ोतरी",
    noStepUp: "बढ़ोतरी नहीं",
    years: "वर्ष",
    invested: "कुल निवेश राशि",
    gains: "अनुमानित रिटर्न",
    futureValue: "अनुमानित भविष्य की राशि",
    breakdown: "निवेश का विवरण",
    investedDescription: "पूरी अवधि में आपके द्वारा जमा की गई राशि",
    gainsDescription: "अनुमानित रिटर्न के आधार पर संभावित वृद्धि",
    futureDescription: "कुल निवेश और अनुमानित रिटर्न",
    exampleTitle: "SIP निवेश का उदाहरण",
    exampleDescription:
      "उदाहरण के लिए, यदि आप बिना वार्षिक स्टेप-अप के 10 वर्षों तक हर महीने ₹5,000 निवेश करते हैं और अनुमानित वार्षिक रिटर्न 12% रहता है, तो भविष्य की राशि लगभग ₹11.5 लाख हो सकती है। आपका कुल निवेश ₹6 लाख होगा और अनुमानित रिटर्न लगभग ₹5.5 लाख होगा।",
    guideTitle: "SIP कैलकुलेटर कैसे काम करता है?",
    guide:
      "सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) में आप नियमित रूप से एक निश्चित राशि निवेश करते हैं। यह कैलकुलेटर अनुमानित वार्षिक रिटर्न से मासिक रिटर्न निकालकर भविष्य की राशि का अनुमान लगाता है। वास्तविक बाजार रिटर्न अलग हो सकता है और इसकी गारंटी नहीं है।",
    formulaTitle: "गणना का तरीका",
    formula:
      "मासिक रिटर्न = (1 + वार्षिक रिटर्न)^(1/12) − 1। माना गया है कि हर महीने के अंत में निवेश किया जाता है। स्टेप-अप चुनने पर हर नए निवेश वर्ष की शुरुआत में मासिक निवेश बढ़ता है।",
    disclaimerTitle: "महत्वपूर्ण डिस्क्लेमर",
    disclaimer:
      "यह केवल अनुमान है, रिटर्न की गारंटी या निवेश की सलाह नहीं। म्यूचुअल फंड निवेश बाजार जोखिमों के अधीन हैं। निवेश करने से पहले योजना से जुड़े सभी दस्तावेज ध्यान से पढ़ें।",
    relatedTitle: "अन्य कैलकुलेटर देखें",
    relatedDescription: "अपनी सैलरी और वित्तीय योजना के लिए इन मुफ्त टूल्स का उपयोग करें।",
    ctcCalculator: "CTC से इन-हैंड सैलरी कैलकुलेटर",
    salaryHikeCalculator: "सैलरी हाइक कैलकुलेटर",
    home: "होम",
    invalidInvestment: "₹0 से अधिक मासिक निवेश दर्ज करें।",
    invalidReturn: "0% से 20% के बीच वार्षिक रिटर्न दर्ज करें।",
    invalidDuration: "1 से 40 के बीच पूरे वर्षों की अवधि दर्ज करें।",
    invalidStepUp: "मान्य वार्षिक स्टेप-अप दर चुनें।"
  },
} satisfies Record<Language, Record<string, string>>;

function formatCurrency(value: number, language: Language) {
  return new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateSip(
  monthlyInvestment: number,
  annualReturnPercent: number,
  years: number,
  stepUpPercent: number,
) {
  const monthlyRate =
    Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
  const totalMonths = years * 12;
  let totalInvested = 0;
  let futureValue = 0;

  for (let month = 1; month <= totalMonths; month += 1) {
    const investmentYear = Math.floor((month - 1) / 12);
    const contribution =
      monthlyInvestment * Math.pow(1 + stepUpPercent / 100, investmentYear);

    totalInvested += contribution;
    futureValue = futureValue * (1 + monthlyRate) + contribution;
  }

  return {
    totalInvested,
    estimatedReturns: Math.max(0, futureValue - totalInvested),
    futureValue,
  };
}

export default function SipCalculatorPage() {
  const { language } = usePreferences();
  const t = content[language as Language];

  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [duration, setDuration] = useState("10");
  const [stepUp, setStepUp] = useState("0");

  const investment = Number(monthlyInvestment);
  const returnRate = Number(annualReturn);
  const years = Number(duration);
  const stepUpRate = Number(stepUp);

  const investmentValid =
    monthlyInvestment.trim() !== "" &&
    Number.isFinite(investment) &&
    investment > 0 &&
    investment <= 100000000;

  const returnValid =
    annualReturn.trim() !== "" &&
    Number.isFinite(returnRate) &&
    returnRate >= 0 &&
    returnRate <= 20;

  const durationValid =
    duration.trim() !== "" &&
    Number.isFinite(years) &&
    Number.isInteger(years) &&
    years >= 1 &&
    years <= 40;

  const stepUpValid =
    Number.isFinite(stepUpRate) &&
    [0, 5, 10].includes(stepUpRate);

  const valid =
    investmentValid && returnValid && durationValid && stepUpValid;

  const result = useMemo(() => {
    if (!valid) return null;
    return calculateSip(investment, returnRate, years, stepUpRate);
  }, [valid, investment, returnRate, years, stepUpRate]);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#07111F] dark:text-white";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111F] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
          >
            ← {t.home}
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t.label}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            {t.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#102131]">
            <h2 className="text-xl font-bold">{t.inputsTitle}</h2>

            <div className="mt-6">
              <label htmlFor="monthlyInvestment" className="text-sm font-medium">
                {t.monthlyInvestment} (₹)
              </label>
              <input
                id="monthlyInvestment"
                type="number"
                min="1"
                max="100000000"
                step="500"
                inputMode="numeric"
                value={monthlyInvestment}
                onChange={(event) => setMonthlyInvestment(event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="annualReturn" className="text-sm font-medium">
                {t.annualReturn}
              </label>
              <input
                id="annualReturn"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={annualReturn}
                onChange={(event) => setAnnualReturn(event.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                0%–20%
              </p>
            </div>

            <div className="mt-5">
              <label htmlFor="duration" className="text-sm font-medium">
                {t.duration}
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                max="40"
                step="1"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                1–40 {t.years}
              </p>
            </div>

            <div className="mt-5">
              <label htmlFor="stepUp" className="text-sm font-medium">
                {t.stepUp}
              </label>
              <select
                id="stepUp"
                value={stepUp}
                onChange={(event) => setStepUp(event.target.value)}
                className={inputClass}
              >
                <option value="0">{t.noStepUp} (0%)</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
              </select>
            </div>

            {!valid && (
              <div
                role="alert"
                className="mt-4 space-y-1 text-sm font-medium text-red-600 dark:text-red-400"
              >
                {!investmentValid && <p>{t.invalidInvestment}</p>}
                {!returnValid && <p>{t.invalidReturn}</p>}
                {!durationValid && <p>{t.invalidDuration}</p>}
                {!stepUpValid && <p>{t.invalidStepUp}</p>}
              </div>
            )}
          </section>

          <section
            aria-live="polite"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10"
          >
            <h2 className="text-xl font-bold">{t.breakdown}</h2>

            {result ? (
              <>
                <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-5 dark:border-white/10 dark:bg-[#0D1B2A]">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {t.futureValue}
                  </p>
                  <p className="mt-2 break-words text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
                    {formatCurrency(result.futureValue, language as Language)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {t.futureDescription}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ResultItem
                    label={t.invested}
                    value={formatCurrency(result.totalInvested, language as Language)}
                    description={t.investedDescription}
                  />
                  <ResultItem
                    label={t.gains}
                    value={formatCurrency(result.estimatedReturns, language as Language)}
                    description={t.gainsDescription}
                  />
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
                {t.invalidDuration}
              </p>
            )}
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#102131]">
          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
            <h2 className="text-xl font-bold">{t.exampleTitle}</h2>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
              {t.exampleDescription}
            </p>
          </div>
          <h2 className="text-2xl font-bold">{t.guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            {t.guide}
          </p>
          <h3 className="mt-6 text-lg font-bold">{t.formulaTitle}</h3>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            {t.formula}
          </p>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
            <h3 className="font-bold">{t.disclaimerTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {t.disclaimer}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#102131]">
          <h2 className="text-2xl font-bold">{t.relatedTitle}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {t.relatedDescription}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/ctc-calculator"
              className="rounded-xl border border-slate-200 p-4 font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:text-blue-300 dark:hover:bg-white/5"
            >
              {t.ctcCalculator} →
            </Link>
            <Link
              href="/salary-hike-calculator"
              className="rounded-xl border border-slate-200 p-4 font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:text-blue-300 dark:hover:bg-white/5"
            >
              {t.salaryHikeCalculator} →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function ResultItem({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-white/10 dark:bg-[#0D1B2A]">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-bold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
