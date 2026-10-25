"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePreferences } from "@/components/PreferencesProvider";
import { calculateTax, type TaxResult } from "./tax-calculations";

function formatCurrency(value: number, language: Language) {
  return new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

type Language = "en" | "hi";

const content = {
  en: {
    label: "TAX CALCULATOR",
    title: "Income Tax Calculator India",
    description:
      "Estimate your income tax for Tax Year 2026–27 and compare India's new and old tax regimes.",
    salary: "Annual gross salary",
    residentIndividual: "I am a resident individual for Indian income-tax purposes",
    deductions: "Eligible old-regime deductions",
    section80C: "Eligible savings investments (Schedule XV / Section 123)",
    section80D: "Health insurance — self/family (Section 126)",
    section80DParents: "Health insurance — parents (Section 126)",
    seniorSelfFamily: "A person covered under my self/family policy meets the applicable senior-citizen age criteria",
    seniorParents: "A parent covered under the policy meets the applicable senior-citizen age criteria",
    nps: "Additional NPS contribution (Section 124(3))",
    otherDeductions: "Other eligible old-regime deductions (enter only amounts you qualify to claim)",
    inputs: "Enter your details",
    results: "Tax regime comparison",
    newRegime: "New tax regime",
    oldRegime: "Old tax regime",
    standardDeduction: "Standard deduction",
    taxableIncome: "Estimated taxable income",
    basicTax: "Income tax after rebate",
    cess: "Health & Education Cess (4%)",
    totalTax: "Estimated total tax",
    monthlyTax: "Monthly tax equivalent",
    saving: "Estimated lower-tax option",
    lowerNew: "The new regime has lower estimated tax.",
    lowerOld: "The old regime has lower estimated tax.",
    equal: "Both regimes have the same estimated tax.",
    difference: "Estimated annual difference",
    guideTitle: "How this calculator works",
    guide:
      "The calculator estimates tax for a salaried individual below age 60. It applies the standard deduction, the new-regime slabs and rebate, or the general old-regime slabs and eligible deductions entered here. The old regime uses simplified deduction inputs. Enter only deductions you are legally eligible to claim; HRA exemptions and some other tax adjustments are not calculated.",
    disclaimerTitle: "Important disclaimer",
    disclaimer:
      "This is an estimate, not tax advice or a complete tax-return computation. It assumes a resident individual below age 60 with salary income only, no surcharge, no special-rate income, and no other income or tax credits. Old-regime deductions are simplified and must be legally eligible. Verify applicable rules before making tax decisions.",
    related: "Explore more calculators",
    ctc: "CTC to In-Hand Salary Calculator",
    hike: "Salary Hike Calculator",
    sip: "SIP Calculator",
    home: "Home",
    rupees: "₹",
    maxDeductionNote:
      "These are simplified old-regime deduction inputs. Eligible savings investments (Schedule XV / Section 123) are capped at ₹1.5 lakh in aggregate, subject to statutory conditions. Additional NPS contributions under Section 124(3) are capped at ₹50,000, subject to eligibility. Section 126 limits depend on the insured people, their ages and applicable conditions. This calculator models insurance-premium limits only, not every eligible medical expense or preventive health-check-up. Enter only amounts you are eligible to claim.",
    deductionLimitError: "Enter a non-negative deduction amount within the allowed limits.",
    salaryError: "This simplified calculator supports annual gross salary up to ₹50 lakh; surcharge is not included.",
    taxYear: "Tax Year 2026–27",
    noTax: "No tax estimated",
  },
  hi: {
    label: "टैक्स कैलकुलेटर",
    title: "इनकम टैक्स कैलकुलेटर",
    description:
      "टैक्स वर्ष 2026–27 के लिए अनुमानित इनकम टैक्स निकालें और नई व पुरानी टैक्स व्यवस्था की तुलना करें।",
    salary: "सालाना कुल वेतन",
    residentIndividual: "मैं भारतीय आयकर के लिए निवासी व्यक्ति हूँ",
    deductions: "पुरानी टैक्स व्यवस्था में पात्र कटौतियाँ",
    section80C: "पात्र बचत निवेश (अनुसूची XV / धारा 123)",
    section80D: "स्वास्थ्य बीमा — स्वयं/परिवार (धारा 126)",
    section80DParents: "स्वास्थ्य बीमा — माता-पिता (धारा 126)",
    seniorSelfFamily: "मेरी स्वयं/परिवार पॉलिसी में शामिल व्यक्ति लागू वरिष्ठ-नागरिक आयु मानदंड पूरा करता है",
    seniorParents: "पॉलिसी में शामिल माता-पिता लागू वरिष्ठ-नागरिक आयु मानदंड पूरा करते हैं",
    nps: "अतिरिक्त NPS योगदान (धारा 124(3))",
    otherDeductions: "अन्य पात्र पुरानी व्यवस्था की कटौतियाँ (केवल दावा करने योग्य राशि दर्ज करें)",
    inputs: "अपनी जानकारी भरें",
    results: "टैक्स व्यवस्था की तुलना",
    newRegime: "नई टैक्स व्यवस्था",
    oldRegime: "पुरानी टैक्स व्यवस्था",
    standardDeduction: "स्टैंडर्ड डिडक्शन",
    taxableIncome: "अनुमानित टैक्स योग्य आय",
    basicTax: "रिबेट के बाद इनकम टैक्स",
    cess: "हेल्थ और एजुकेशन सेस (4%)",
    totalTax: "अनुमानित कुल टैक्स",
    monthlyTax: "मासिक टैक्स के बराबर",
    saving: "कम टैक्स वाला अनुमानित विकल्प",
    lowerNew: "नई व्यवस्था में अनुमानित टैक्स कम है।",
    lowerOld: "पुरानी व्यवस्था में अनुमानित टैक्स कम है।",
    equal: "दोनों व्यवस्थाओं में अनुमानित टैक्स समान है।",
    difference: "अनुमानित सालाना अंतर",
    guideTitle: "यह कैलकुलेटर कैसे काम करता है",
    guide:
      "यह कैलकुलेटर 60 वर्ष से कम उम्र के वेतनभोगी व्यक्ति के लिए टैक्स का अनुमान लगाता है। इसमें स्टैंडर्ड डिडक्शन, नई व्यवस्था की स्लैब और रिबेट या पुरानी व्यवस्था की सामान्य स्लैब और दर्ज की गई पात्र कटौतियाँ शामिल हैं। पुरानी व्यवस्था में कटौतियों की गणना सरल रूप में होती है। केवल कानूनी रूप से पात्र कटौतियाँ दर्ज करें; HRA छूट और कुछ अन्य टैक्स समायोजन शामिल नहीं हैं।",
    disclaimerTitle: "महत्वपूर्ण डिस्क्लेमर",
    disclaimer:
      "यह केवल अनुमान है, टैक्स सलाह या टैक्स रिटर्न की पूरी गणना नहीं। इसमें 60 वर्ष से कम उम्र का निवासी व्यक्ति, केवल वेतन आय, कोई सरचार्ज नहीं, विशेष दर वाली आय नहीं और कोई अन्य आय या टैक्स क्रेडिट नहीं माना गया है। पुरानी व्यवस्था की कटौतियाँ सरल रूप में गणना की जाती हैं और कानूनी रूप से पात्र होनी चाहिए। टैक्स संबंधी निर्णय से पहले लागू नियमों की पुष्टि करें।",
    related: "अन्य कैलकुलेटर देखें",
    ctc: "CTC से इन-हैंड सैलरी कैलकुलेटर",
    hike: "सैलरी हाइक कैलकुलेटर",
    sip: "SIP कैलकुलेटर",
    home: "होम",
    rupees: "₹",
    maxDeductionNote:
      "ये पुरानी टैक्स व्यवस्था की सरल कटौती प्रविष्टियाँ हैं। पात्र बचत निवेश (अनुसूची XV / धारा 123) की कुल सीमा ₹1.5 लाख है, जो वैधानिक शर्तों के अधीन है। धारा 124(3) के तहत अतिरिक्त NPS योगदान की सीमा ₹50,000 है, पात्रता शर्तों के अधीन। धारा 126 की सीमाएँ बीमित व्यक्तियों, उनकी उम्र और लागू शर्तों पर निर्भर करती हैं। यह कैलकुलेटर केवल स्वास्थ्य बीमा प्रीमियम की सीमाओं का अनुमान लगाता है; सभी पात्र चिकित्सा खर्चों या निवारक स्वास्थ्य जाँच को शामिल नहीं करता। केवल वही राशि दर्ज करें जिसका दावा करने के आप पात्र हैं।",
    deductionLimitError: "कटौती की राशि शून्य या उससे अधिक और निर्धारित सीमा के भीतर दर्ज करें।",
    salaryError: "यह सरल कैलकुलेटर ₹50 लाख तक के सालाना कुल वेतन के लिए है; सरचार्ज शामिल नहीं है।",
    taxYear: "टैक्स वर्ष 2026–27",
    noTax: "अनुमानित टैक्स नहीं",
  },
} satisfies Record<Language, Record<string, string>>;


function ResultCard({
title,
result,
t,
language,
}: {
title: string;
result: TaxResult;
t: Record<string, string>;
language: Language;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#102131]">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-5 space-y-4">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t.standardDeduction}</span>
          <span className="font-semibold">{formatCurrency(result.standardDeduction, language as Language)}</span>
        </div>
        {result.deductions > 0 && (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t.deductions}</span>
            <span className="font-semibold">{formatCurrency(result.deductions, language as Language)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t.taxableIncome}</span>
          <span className="font-semibold">{formatCurrency(result.taxableIncome, language as Language)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t.basicTax}</span>
          <span className="font-semibold">{formatCurrency(result.incomeTax, language as Language)}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t.cess}</span>
          <span className="font-semibold">{formatCurrency(result.cess, language as Language)}</span>
        </div>
        <div className="border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex justify-between gap-4">
            <span className="font-bold">{t.totalTax}</span>
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(result.totalTax, language as Language)}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t.monthlyTax}</span>
            <span className="font-semibold">{formatCurrency(result.totalTax / 12, language as Language)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function IncomeTaxCalculatorPage() {
  const { language } = usePreferences();
  const t = content[language as Language];

  const [salaryInput, setSalaryInput] = useState("1200000");
  const [isResident, setIsResident] = useState(true);
  const [section80CInput, setSection80CInput] = useState("0");
  const [section80DInput, setSection80DInput] = useState("0");
  const [section80DParentsInput, setSection80DParentsInput] = useState("0");
  const [seniorSelfFamily, setSeniorSelfFamily] = useState(false);
  const [seniorParents, setSeniorParents] = useState(false);
  const [npsInput, setNpsInput] = useState("0");
  const [otherDeductionsInput, setOtherDeductionsInput] = useState("0");

  const salary = Number(salaryInput);
  const section80C = Number(section80CInput);
  const section80D = Number(section80DInput);
  const section80DParents = Number(section80DParentsInput);
  const nps = Number(npsInput);
  const otherDeductions = Number(otherDeductionsInput);
  const section80DLimit = seniorSelfFamily ? 50_000 : 25_000;
  const section80DParentsLimit = seniorParents ? 50_000 : 25_000;

  const salaryValid =
    salaryInput.trim() !== "" &&
    Number.isFinite(salary) &&
    salary >= 0 &&
    salary <= 5_000_000;

  const deductionsValid = [
    section80C,
    section80D,
    section80DParents,
    nps,
    otherDeductions,
  ].every((value) => Number.isFinite(value) && value >= 0) &&
    section80C <= 150_000 &&
    nps <= 50_000 &&
    section80D <= section80DLimit &&
    section80DParents <= section80DParentsLimit &&
    otherDeductions <= 1_000_000;

  const valid = salaryValid && deductionsValid;

  const results = useMemo(() => {
    if (!valid) return null;
    const oldDeductions = section80C + section80D + section80DParents + nps + otherDeductions;
    return {
      newRegime: calculateTax(salary, "new", 0, isResident),
      oldRegime: calculateTax(salary, "old", oldDeductions, isResident),
    };
  }, [
    valid,
    salary,
    isResident,
    section80C,
    section80D,
    section80DParents,
    nps,
    otherDeductions,
  ]);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#07111F] dark:text-white";


  const difference = results
    ? Math.abs(results.newRegime.totalTax - results.oldRegime.totalTax)
    : 0;

  const winner = results
    ? results.newRegime.totalTax < results.oldRegime.totalTax
      ? "new"
      : results.oldRegime.totalTax < results.newRegime.totalTax
        ? "old"
        : "equal"
    : "equal";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111F] dark:text-white">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300">
            ← {t.home}
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t.label}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">{t.description}</p>
          <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
            {t.taxYear}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#102131]">
            <h2 className="text-xl font-bold">{t.inputs}</h2>

            <div className="mt-6">
              <label htmlFor="salary" className="text-sm font-medium">{t.salary} (₹)</label>
              <input
                id="salary"
                type="number"
                min="0"
                max="5000000"
                step="10000"
                inputMode="numeric"
                value={salaryInput}
                onChange={(event) => setSalaryInput(event.target.value)}
                className={inputClass}
              />
              {!salaryValid && <p className="mt-2 text-sm text-red-600">{t.salaryError}</p>}
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                checked={isResident}
                onChange={(event) => setIsResident(event.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-600"
              />
              <span>{t.residentIndividual}</span>
            </label>

            <h3 className="mt-7 text-base font-bold">{t.deductions}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{t.maxDeductionNote}</p>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 text-sm leading-6">
                <input
                  type="checkbox"
                  checked={seniorSelfFamily}
                  onChange={(event) => setSeniorSelfFamily(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span>{t.seniorSelfFamily}</span>
              </label>
              <label className="flex items-start gap-3 text-sm leading-6">
                <input
                  type="checkbox"
                  checked={seniorParents}
                  onChange={(event) => setSeniorParents(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span>{t.seniorParents}</span>
              </label>
            </div>

            {[
              { id: "section80C", label: t.section80C, value: section80CInput, setter: setSection80CInput, max: 150000 },
              { id: "section80D", label: t.section80D, value: section80DInput, setter: setSection80DInput, max: section80DLimit },
              { id: "section80DParents", label: t.section80DParents, value: section80DParentsInput, setter: setSection80DParentsInput, max: section80DParentsLimit },
              { id: "nps", label: t.nps, value: npsInput, setter: setNpsInput, max: 50000 },
              { id: "otherDeductions", label: t.otherDeductions, value: otherDeductionsInput, setter: setOtherDeductionsInput, max: 1000000 },
            ].map((item) => (
              <div className="mt-4" key={item.id}>
                <label htmlFor={item.id} className="text-sm font-medium">{item.label} (₹)</label>
                <input
                  id={item.id}
                  type="number"
                  min="0"
                  max={item.max}
                  step="1000"
                  inputMode="numeric"
                  value={item.value}
                  onChange={(event) => item.setter(event.target.value)}
                  className={inputClass}
                />
              </div>
            ))}

            {!deductionsValid && <p className="mt-3 text-sm text-red-600">{t.deductionLimitError}</p>}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">{t.results}</h2>
            {results ? (
              <div className="space-y-5">
                <ResultCard title={t.newRegime} result={results.newRegime} t={t} language={language as Language} />
                <ResultCard title={t.oldRegime} result={results.oldRegime} t={t} language={language as Language} />
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/5">
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{t.saving}</p>
                  <p className="mt-2 text-lg font-extrabold text-emerald-800 dark:text-emerald-300">
                    {winner === "new" ? t.lowerNew : winner === "old" ? t.lowerOld : t.equal}
                  </p>
                  <p className="mt-2 text-sm text-emerald-900 dark:text-emerald-200">
                    {t.difference}: {formatCurrency(difference, language as Language)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-[#102131] dark:text-slate-400">
                {salaryValid ? t.deductionLimitError : t.salaryError}
              </div>
            )}
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#102131]">
          <h2 className="text-xl font-bold">{t.guideTitle}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t.guide}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-400/20 dark:bg-amber-400/5">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">{t.disclaimerTitle}</h2>
          <p className="mt-2 leading-7 text-amber-900 dark:text-amber-100/80">{t.disclaimer}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">{t.related}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/ctc-calculator", label: t.ctc },
              { href: "/salary-hike-calculator", label: t.hike },
              { href: "/sip-calculator", label: t.sip },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold transition hover:border-emerald-400 dark:border-white/10 dark:bg-[#102131]"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
