"use client";

import { useState } from "react";
import { usePreferences } from "@/components/PreferencesProvider";

import { calculateSalary, SalaryResult } from "@/lib/salary/calculator";

import { SalaryStructureMode, TaxRegime, PFMode } from "@/lib/salary/types";

// ======================================================
// TRANSLATIONS
// ======================================================

const TEXT = {
  en: {
    calculator: "SALARY CALCULATOR",

    title: "CTC to In-Hand Salary Calculator",

    description:
      "Calculate your estimated monthly take-home salary from your annual CTC.",

    salaryStructure: "Salary Structure",

    enterSalary: "Enter your annual salary details.",

    reset: "Reset",

    salaryStructureMode: "Salary Structure Mode",

    simpleCtc: "Simple CTC",

    detailedCtc: "Detailed CTC",

    simpleDescription:
      "The calculator estimates the remaining salary components automatically.",

    detailedDescription:
      "Enter the actual salary components. Special Allowance is automatically balanced.",

    annualCtc: "Annual CTC",

    basicPercent: "Basic Salary (% of CTC)",

    basicSalary: "Basic Salary",

    pfCalculation: "PF Calculation",

    standardPf: "Standard PF",

    actualPf: "Actual PF",

    customPf: "Custom PF",

    standardPfDescription: "Uses Moneyva's current standard EPF calculation.",

    actualPfDescription:
      "Enter the employee and employer PF amounts from your salary structure.",

    customPfDescription:
      "Enter your preferred employee and employer PF amounts.",

    employeePf: "Employee EPF",

    employerPf: "Employer EPF",

    employerEps: "Employer EPS",

    employerPfTotal: "Employer PF Total",

    annualHra: "Annual HRA",

    otherAllowances: "Other Annual Allowances",

    variablePay: "Annual Variable Pay",

    variableDescription: "Bonus or performance-linked component.",

    annualGratuity: "Annual Gratuity",

    automaticallyCalculated: "Automatically calculated",

    gratuityDescription: "Leave blank to automatically calculate gratuity.",

    specialAllowance: "Special Allowance",

    automaticallyBalances:
      "This amount automatically balances your CTC after the other components.",

    ctcComponents: "CTC Components",

    remainingCtc: "Remaining CTC",

    incomeTaxRegime: "Income Tax Regime",

    newRegime: "New Regime",

    oldRegime: "Old Regime",

    regularMonthly: "Regular Monthly Take-Home",

    regularDescription:
      "Your estimated regular monthly salary after employee PF and allocated tax.",

    averageMonthly: "Average Monthly Take-Home",

    annualTakeHome: "Annual Take-Home",

    salaryBreakdown: "Salary Breakdown",

    fixedGross: "Fixed Gross Salary",

    grossSalary: "Gross Salary",

    gratuity: "Gratuity",

    standardDeduction: "Standard Deduction",

    taxableIncome: "Taxable Income",

    incomeTax: "Income Tax",

    surcharge: "Surcharge",

    cess: "Health & Education Cess",

    totalTax: "Total Tax",

    salarySummary: "Your Salary Summary",

    important: "Important:",

    disclaimer:
      "This calculator provides an estimate. Actual take-home salary may vary based on your employer's salary structure, tax deductions, PF rules and other applicable components.",
  },

  hi: {
    calculator: "वेतन कैलकुलेटर",

    title: "CTC से इन-हैंड सैलरी कैलकुलेटर",

    description:
      "अपनी वार्षिक CTC से अनुमानित मासिक इन-हैंड सैलरी की गणना करें।",

    salaryStructure: "वेतन संरचना",

    enterSalary: "अपनी वार्षिक सैलरी की जानकारी दर्ज करें।",

    reset: "रीसेट",

    salaryStructureMode: "वेतन संरचना मोड",

    simpleCtc: "सिंपल CTC",

    detailedCtc: "डिटेल्ड CTC",

    simpleDescription: "कैलकुलेटर बाकी सैलरी घटकों का अनुमान अपने आप लगाता है।",

    detailedDescription:
      "वास्तविक सैलरी घटक दर्ज करें। स्पेशल अलाउंस अपने आप बैलेंस होगा।",

    annualCtc: "वार्षिक CTC",

    basicPercent: "बेसिक सैलरी (CTC का %)",

    basicSalary: "बेसिक सैलरी",

    pfCalculation: "PF गणना",

    standardPf: "स्टैंडर्ड PF",

    actualPf: "वास्तविक PF",

    customPf: "कस्टम PF",

    standardPfDescription:
      "Moneyva की वर्तमान स्टैंडर्ड EPF गणना का उपयोग करता है।",

    actualPfDescription:
      "अपनी सैलरी संरचना के अनुसार कर्मचारी और नियोक्ता PF दर्ज करें।",

    customPfDescription:
      "अपनी पसंद के कर्मचारी और नियोक्ता PF की राशि दर्ज करें।",

    employeePf: "कर्मचारी EPF",

    employerPf: "नियोक्ता EPF",

    employerEps: "नियोक्ता EPS",

    employerPfTotal: "कुल नियोक्ता PF",

    annualHra: "वार्षिक HRA",

    otherAllowances: "अन्य वार्षिक अलाउंस",

    variablePay: "वार्षिक वेरिएबल पे",

    variableDescription: "बोनस या प्रदर्शन आधारित राशि।",

    annualGratuity: "वार्षिक ग्रेच्युटी",

    automaticallyCalculated: "अपने आप गणना",

    gratuityDescription: "खाली छोड़ने पर ग्रेच्युटी अपने आप गणना होगी।",

    specialAllowance: "स्पेशल अलाउंस",

    automaticallyBalances:
      "यह राशि बाकी घटकों के बाद आपकी CTC को अपने आप बैलेंस करती है।",

    ctcComponents: "CTC घटक",

    remainingCtc: "बाकी CTC",

    incomeTaxRegime: "इनकम टैक्स व्यवस्था",

    newRegime: "नई व्यवस्था",

    oldRegime: "पुरानी व्यवस्था",

    regularMonthly: "नियमित मासिक इन-हैंड",

    regularDescription:
      "कर्मचारी PF और अनुमानित टैक्स के बाद आपकी अनुमानित नियमित मासिक सैलरी।",

    averageMonthly: "औसत मासिक इन-हैंड",

    annualTakeHome: "वार्षिक इन-हैंड",

    salaryBreakdown: "सैलरी विवरण",

    fixedGross: "फिक्स्ड ग्रॉस सैलरी",

    grossSalary: "ग्रॉस सैलरी",

    gratuity: "ग्रेच्युटी",

    standardDeduction: "स्टैंडर्ड डिडक्शन",

    taxableIncome: "टैक्स योग्य आय",

    incomeTax: "इनकम टैक्स",

    surcharge: "सरचार्ज",

    cess: "हेल्थ एवं एजुकेशन सेस",

    totalTax: "कुल टैक्स",

    salarySummary: "आपकी सैलरी का सारांश",

    important: "महत्वपूर्ण:",

    disclaimer:
      "यह कैलकुलेटर अनुमान देता है। वास्तविक इन-हैंड सैलरी आपके नियोक्ता की सैलरी संरचना, टैक्स कटौती, PF नियमों और अन्य लागू घटकों के आधार पर अलग हो सकती है।",
  },
};

// ======================================================
// DEFAULTS
// ======================================================

const DEFAULTS = {
  ctc: 0,

  basicPercent: 40,

  hra: 0,

  otherAllowances: 0,

  variablePay: 0,

  gratuity: undefined as number | undefined,

  customEmployeePF: 0,

  customEmployerPF: 0,

  taxRegime: "new" as TaxRegime,

  mode: "simple" as SalaryStructureMode,

  pfMode: "standard" as PFMode,
};

// ======================================================
// PAGE
// ======================================================

export default function CTCCalculator() {
  // ====================================================
  // GLOBAL MONEYVA PREFERENCES
  // ====================================================

  const { theme, language } = usePreferences();

  const isDark = theme === "dark";

  const t = TEXT[language === "hi" ? "hi" : "en"];

  // ====================================================
  // SALARY INPUTS
  // ====================================================

  const [ctc, setCtc] = useState(DEFAULTS.ctc);

  const [basicPercent, setBasicPercent] = useState(DEFAULTS.basicPercent);

  const [hra, setHra] = useState(DEFAULTS.hra);

  const [otherAllowances, setOtherAllowances] = useState(
    DEFAULTS.otherAllowances,
  );

  const [variablePay, setVariablePay] = useState(DEFAULTS.variablePay);

  // ====================================================
  // PF
  // ====================================================

  const [pfMode, setPfMode] = useState<PFMode>(DEFAULTS.pfMode);

  const [customEmployeePF, setCustomEmployeePF] = useState(
    DEFAULTS.customEmployeePF,
  );

  const [customEmployerPF, setCustomEmployerPF] = useState(
    DEFAULTS.customEmployerPF,
  );

  // ====================================================
  // GRATUITY
  // ====================================================

  const [gratuity, setGratuity] = useState<number | undefined>(
    DEFAULTS.gratuity,
  );

  // ====================================================
  // TAX
  // ====================================================

  const [taxRegime, setTaxRegime] = useState<TaxRegime>(DEFAULTS.taxRegime);

  // ====================================================
  // MODE
  // ====================================================

  const [mode, setMode] = useState<SalaryStructureMode>(DEFAULTS.mode);

  // ====================================================
  // BASIC SALARY
  // ====================================================

  const basicSalary = Math.round((ctc * basicPercent) / 100);

  // ====================================================
  // CALCULATE
  // ====================================================

  const result: SalaryResult = calculateSalary({
    ctc,

    basicPercent,

    hra,

    specialAllowance: 0,

    otherAllowances,

    variablePay,

    taxRegime,

    mode,

    pfMode,

    customEmployeePF: pfMode !== "standard" ? customEmployeePF : undefined,

    customEmployerPF: pfMode !== "standard" ? customEmployerPF : undefined,

    employerPF: mode === "detailed" ? customEmployerPF : undefined,

    gratuity: mode === "detailed" ? gratuity : undefined,
  });

  // ====================================================
  // DETAILED CTC
  // ====================================================

  const detailedCtcTotal =
    result.basicSalary +
    result.hra +
    result.specialAllowance +
    result.otherAllowances +
    result.variablePay +
    result.employerPF +
    result.gratuity;

  const detailedRemainingCtc = ctc - detailedCtcTotal;

  // ====================================================
  // AVERAGE MONTHLY TAKE HOME
  // ====================================================

  const averageMonthlyTakeHome = Math.round(result.annualTakeHome / 12);

  // ====================================================
  // RESET
  // ====================================================

  function handleReset() {
    setCtc(DEFAULTS.ctc);

    setBasicPercent(DEFAULTS.basicPercent);

    setHra(DEFAULTS.hra);

    setOtherAllowances(DEFAULTS.otherAllowances);

    setVariablePay(DEFAULTS.variablePay);

    setPfMode(DEFAULTS.pfMode);

    setCustomEmployeePF(DEFAULTS.customEmployeePF);

    setCustomEmployerPF(DEFAULTS.customEmployerPF);

    setGratuity(DEFAULTS.gratuity);

    setTaxRegime(DEFAULTS.taxRegime);

    setMode(DEFAULTS.mode);
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <main
      className={`
        min-h-screen
        transition-colors
        duration-300

        ${isDark ? "bg-[#07111F] text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      <section
        className="
          px-5
          py-10
          sm:px-8
          lg:px-10
          lg:py-14
        "
      >
        <div
          className="
            mx-auto
            max-w-6xl
          "
        >
          {/* ==================================================
              TITLE
          ================================================== */}

          <div>
            <p
              className="
                text-sm
                font-bold
                tracking-wide
                text-emerald-500
                dark:text-emerald-400
              "
            >
              {t.calculator}
            </p>

            <h1
              className="
                mt-2
                text-4xl
                font-extrabold
                tracking-tight
                sm:text-5xl
              "
            >
              {t.title}
            </h1>

            <p
              className="
                mt-3
                text-base
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.description}
            </p>
          </div>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div
            className="
              mt-8
              grid
              gap-8
              lg:grid-cols-2
              lg:items-start
            "
          >
            {/* =================================================
                INPUT CARD
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm

                dark:border-white/10
                dark:bg-[#0D1B2A]
                dark:shadow-none
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {t.salaryStructure}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {t.enterSalary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    transition

                    hover:bg-slate-50

                    dark:border-white/10
                    dark:bg-white/5
                    dark:hover:bg-white/10
                  "
                >
                  {t.reset}
                </button>
              </div>

              {/* MODE */}

              <div
                className="
                  mt-6
                "
              >
                <label
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {t.salaryStructureMode}
                </label>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <ModeButton
                    active={mode === "simple"}
                    onClick={() => setMode("simple")}
                  >
                    {t.simpleCtc}
                  </ModeButton>

                  <ModeButton
                    active={mode === "detailed"}
                    onClick={() => setMode("detailed")}
                  >
                    {t.detailedCtc}
                  </ModeButton>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {mode === "simple"
                    ? t.simpleDescription
                    : t.detailedDescription}
                </p>
              </div>

              {/* CTC */}

              <MoneyInput label={t.annualCtc} value={ctc} onChange={setCtc} />

              {/* BASIC */}

              <div
                className="
                  mt-5
                "
              >
                <label
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {t.basicPercent}
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={basicPercent}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setBasicPercent(Math.min(100, Math.max(0, value)));
                  }}
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    outline-none

                    focus:border-emerald-500
                    focus:ring-1
                    focus:ring-emerald-500

                    dark:border-white/10
                    dark:bg-[#07111F]
                    dark:text-white
                  "
                />

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {t.basicSalary}: ₹{formatCurrency(basicSalary)}
                </p>
              </div>

              {/* PF */}

              <div
                className="
                  mt-5
                "
              >
                <label
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {t.pfCalculation}
                </label>

                <select
                  value={pfMode}
                  onChange={(e) => setPfMode(e.target.value as PFMode)}
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-slate-900
                    outline-none

                    focus:border-emerald-500
                    focus:ring-1
                    focus:ring-emerald-500

                    dark:border-white/10
                    dark:bg-[#07111F]
                    dark:text-white
                  "
                >
                  <option value="standard">{t.standardPf}</option>

                  <option value="actual">{t.actualPf}</option>

                  <option value="custom">{t.customPf}</option>
                </select>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {pfMode === "standard" && t.standardPfDescription}

                  {pfMode === "actual" && t.actualPfDescription}

                  {pfMode === "custom" && t.customPfDescription}
                </p>
              </div>

              {/* CUSTOM PF */}

              {pfMode !== "standard" && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-slate-50
                    p-4
                    dark:bg-white/[0.03]
                  "
                >
                  <MoneyInput
                    label={t.employeePf}
                    value={customEmployeePF}
                    onChange={setCustomEmployeePF}
                  />

                  <MoneyInput
                    label={t.employerPf}
                    value={customEmployerPF}
                    onChange={setCustomEmployerPF}
                  />
                </div>
              )}

              {/* HRA */}

              <MoneyInput label={t.annualHra} value={hra} onChange={setHra} />

              {/* OTHER */}

              <MoneyInput
                label={t.otherAllowances}
                value={otherAllowances}
                onChange={setOtherAllowances}
              />

              {/* VARIABLE */}

              <MoneyInput
                label={t.variablePay}
                value={variablePay}
                onChange={setVariablePay}
                helper={t.variableDescription}
              />

              {/* DETAILED */}

              {mode === "detailed" && (
                <>
                  {/* GRATUITY */}

                  <div
                    className="
                      mt-5
                    "
                  >
                    <label
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {t.annualGratuity}
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={gratuity ?? ""}
                      placeholder={t.automaticallyCalculated}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setGratuity(undefined);

                          return;
                        }

                        setGratuity(Math.max(0, Number(e.target.value)));
                      }}
                      className="
                        mt-2
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        outline-none

                        focus:border-emerald-500
                        focus:ring-1
                        focus:ring-emerald-500

                        dark:border-white/10
                        dark:bg-[#07111F]
                        dark:text-white
                      "
                    />

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {t.gratuityDescription}
                    </p>
                  </div>

                  {/* SPECIAL */}

                  <div
                    className="
                      mt-5
                    "
                  >
                    <label
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {t.specialAllowance}
                    </label>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3

                        dark:border-white/10
                        dark:bg-white/[0.03]
                      "
                    >
                      <span
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {t.automaticallyCalculated}
                      </span>

                      <strong>
                        ₹{formatCurrency(result.specialAllowance)}
                      </strong>
                    </div>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {t.automaticallyBalances}
                    </p>
                  </div>

                  {/* CTC TOTAL */}

                  <div
                    className="
                      mt-5
                      rounded-xl
                      bg-slate-50
                      p-4

                      dark:bg-white/[0.03]
                    "
                  >
                    <div
                      className="
                        flex
                        justify-between
                        text-sm
                      "
                    >
                      <span>{t.ctcComponents}</span>

                      <strong>₹{formatCurrency(detailedCtcTotal)}</strong>
                    </div>

                    <div
                      className="
                        mt-2
                        flex
                        justify-between
                        text-sm
                      "
                    >
                      <span>{t.remainingCtc}</span>

                      <strong
                        className={
                          Math.abs(detailedRemainingCtc) < 1
                            ? "text-emerald-500"
                            : "text-red-500"
                        }
                      >
                        ₹{formatCurrency(detailedRemainingCtc)}
                      </strong>
                    </div>
                  </div>
                </>
              )}

              {/* TAX */}

              <div
                className="
                  mt-6
                "
              >
                <label
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {t.incomeTaxRegime}
                </label>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <ModeButton
                    active={taxRegime === "new"}
                    onClick={() => setTaxRegime("new")}
                  >
                    {t.newRegime}
                  </ModeButton>

                  <ModeButton
                    active={taxRegime === "old"}
                    onClick={() => setTaxRegime("old")}
                  >
                    {t.oldRegime}
                  </ModeButton>
                </div>
              </div>
            </div>

            {/* =================================================
                RESULT
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-500
                via-emerald-500
                to-teal-600
                p-6
                text-white
                shadow-xl
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-white/80
                "
              >
                {t.regularMonthly}
              </p>

              <h2
                className="
                  mt-2
                  text-4xl
                  font-extrabold
                  sm:text-5xl
                "
              >
                ₹{formatCurrency(result.monthlyFixedTakeHome)}
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/80
                "
              >
                {t.regularDescription}
              </p>

              {/* SUMMARY */}

              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <ResultBox
                  label={t.averageMonthly}
                  value={averageMonthlyTakeHome}
                />

                <ResultBox
                  label={t.annualTakeHome}
                  value={result.annualTakeHome}
                />
              </div>

              {/* VARIABLE */}

              <div
                className="
                  mt-3
                  rounded-xl
                  bg-black/10
                  p-4
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    text-sm
                  "
                >
                  <span
                    className="
                      text-white/80
                    "
                  >
                    {t.variablePay}
                  </span>

                  <strong>{formatIndianCurrency(result.variablePay)}</strong>
                </div>
              </div>

              {/* BREAKDOWN */}

              <div
                className="
                  mt-8
                "
              >
                <h3
                  className="
                    mb-2
                    text-lg
                    font-bold
                  "
                >
                  {t.salaryBreakdown}
                </h3>

                <Breakdown label={t.annualCtc} value={result.ctc} />

                <Breakdown label={t.basicSalary} value={result.basicSalary} />

                <Breakdown label={t.annualHra} value={result.hra} />

                <Breakdown
                  label={t.specialAllowance}
                  value={result.specialAllowance}
                />

                <Breakdown
                  label={t.otherAllowances}
                  value={result.otherAllowances}
                />

                <Breakdown
                  label={t.fixedGross}
                  value={result.fixedGrossSalary}
                />

                <Breakdown label={t.variablePay} value={result.variablePay} />

                <Breakdown label={t.grossSalary} value={result.grossSalary} />

                <Breakdown label={t.employeePf} value={result.employeePF} />

                <Breakdown label={t.employerPf} value={result.employerPF} />

                <Breakdown label={t.gratuity} value={result.gratuity} />

                <Breakdown
                  label={t.standardDeduction}
                  value={result.standardDeduction}
                />

                <Breakdown
                  label={t.taxableIncome}
                  value={result.taxableIncome}
                />

                <Breakdown label={t.incomeTax} value={result.incomeTax} />

                <Breakdown label={t.surcharge} value={0} />

                <Breakdown label={t.cess} value={result.cess} />

                <Breakdown label={t.totalTax} value={result.totalTax} last />
              </div>
            </div>
          </div>

          {/* ==================================================
              SALARY SUMMARY
          ================================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm

              dark:border-white/10
              dark:bg-[#0D1B2A]
            "
          >
            <h2
              className="
                text-xl
                font-bold
              "
            >
              {t.salarySummary}
            </h2>

            {/* =====================================================
    SALARY RESULT SUMMARY
===================================================== */}

            <div
              className="
    mt-8
    overflow-hidden
    rounded-3xl
    border
    border-emerald-500/20
    bg-gradient-to-br
    from-emerald-50
    via-white
    to-white
    shadow-xl
    shadow-emerald-500/5

    dark:border-emerald-400/20
    dark:from-[#0D2A2A]
    dark:via-[#0D1B2A]
    dark:to-[#0D1B2A]
    dark:shadow-black/20
  "
            >
              {/* PRIMARY RESULT */}

              <div
                className="
      border-b
      border-emerald-500/10
      px-6
      py-8
      text-center
      sm:px-8
      sm:py-10
      dark:border-white/10
    "
              >
                <p
                  className="
        text-xs
        font-bold
        uppercase
        tracking-[0.18em]
        text-emerald-600
        dark:text-emerald-400
      "
                >
                  {t.regularMonthly}
                </p>

                <div
                  className="
        mt-3
        text-4xl
        font-black
        tracking-tight
        text-slate-950
        sm:text-5xl
        dark:text-white
      "
                >
                  ₹{formatCurrency(result.monthlyFixedTakeHome)}
                </div>

                <p
                  className="
        mx-auto
        mt-3
        max-w-lg
        text-sm
        leading-6
        text-slate-500
        dark:text-slate-400
      "
                >
                  {t.regularDescription}
                </p>
              </div>

              {/* SECONDARY RESULTS */}

              <div
                className="
      grid
      grid-cols-1
      divide-y
      divide-slate-200

      sm:grid-cols-3
      sm:divide-x
      sm:divide-y-0

      dark:divide-white/10
    "
              >
                {/* AVERAGE MONTHLY */}

                <div
                  className="
        px-5
        py-6
        text-center
        sm:px-6
      "
                >
                  <p
                    className="
          text-xs
          font-medium
          text-slate-500
          dark:text-slate-400
        "
                  >
                    {t.averageMonthly}
                  </p>

                  <p
                    className="
          mt-2
          text-xl
          font-extrabold
          text-slate-900
          dark:text-white
        "
                  >
                    {formatIndianCurrency(averageMonthlyTakeHome)}
                  </p>
                </div>

                {/* ANNUAL TAKE HOME */}

                <div
                  className="
        px-5
        py-6
        text-center
        sm:px-6
      "
                >
                  <p
                    className="
          text-xs
          font-medium
          text-slate-500
          dark:text-slate-400
        "
                  >
                    {t.annualTakeHome}
                  </p>

                  <p
                    className="
          mt-2
          text-xl
          font-extrabold
          text-slate-900
          dark:text-white
        "
                  >
                    {formatIndianCurrency(result.annualTakeHome)}
                  </p>
                </div>

                {/* TOTAL TAX */}

                <div
                  className="
        px-5
        py-6
        text-center
        sm:px-6
      "
                >
                  <p
                    className="
          text-xs
          font-medium
          text-slate-500
          dark:text-slate-400
        "
                  >
                    {t.totalTax}
                  </p>

                  <p
                    className="
          mt-2
          text-xl
          font-extrabold
          text-slate-900
          dark:text-white
        "
                  >
                    {formatIndianCurrency(result.totalTax)}
                  </p>
                </div>
              </div>

              {/* VARIABLE PAY */}

              <div
                className="
      flex
      flex-col
      gap-2
      border-t
      border-emerald-500/10
      bg-emerald-500/[0.04]
      px-6
      py-4

      sm:flex-row
      sm:items-center
      sm:justify-between

      dark:border-white/10
      dark:bg-emerald-400/[0.04]
    "
              >
                <span
                  className="
        text-sm
        font-medium
        text-slate-600
        dark:text-slate-400
      "
                >
                  {t.variablePay}
                </span>

                <span
                  className="
        text-sm
        font-bold
        text-emerald-600
        dark:text-emerald-400
      "
                >
                  ₹{formatCurrency(variablePay)}
                </span>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}

          <div
            className="
              mt-8
              rounded-xl
              border
              border-slate-200
              bg-white
              p-5
              text-sm
              leading-6
              text-slate-600

              dark:border-white/10
              dark:bg-[#0D1B2A]
              dark:text-slate-400
            "
          >
            <strong
              className="
                text-slate-900
                dark:text-white
              "
            >
              {t.important}
            </strong>{" "}
            {t.disclaimer}
          </div>
        </div>
      </section>
    </main>
  );
}

// ======================================================
// MONEY INPUT
// ======================================================

function formatIndianCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
function MoneyInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helper?: string;
}) {
  return (
    <div className="mt-5">
      <label
        className="
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <div className="relative mt-2">
        <span
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
            dark:text-slate-400
          "
        >
          ₹
        </span>

        <input
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value;

            if (raw === "") {
              onChange(0);
              return;
            }

            const parsed = Number(raw);

            if (!Number.isFinite(parsed)) {
              onChange(0);
              return;
            }

            onChange(Math.max(0, parsed));
          }}
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            bg-white
            py-3
            pl-10
            pr-4
            text-slate-900
            outline-none
            transition

            placeholder:text-slate-400

            focus:border-emerald-500
            focus:ring-1
            focus:ring-emerald-500

            dark:border-white/10
            dark:bg-[#07111F]
            dark:text-white
            dark:placeholder:text-slate-600
          "
        />
      </div>

      {value > 0 && (
        <p
          className="
            mt-1
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          ₹{value.toLocaleString("en-IN")}
        </p>
      )}

      {helper && (
        <p
          className="
            mt-1
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          {helper}
        </p>
      )}
    </div>
  );
}

// ======================================================
// MODE BUTTON
// ======================================================

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;

  onClick: () => void;

  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}

      className={`
        rounded-lg
        border
        px-4
        py-3
        text-sm
        font-semibold
        transition

        ${
          active
            ? `
              border-emerald-500
              bg-emerald-500/10
              text-emerald-600

              dark:text-emerald-300
            `
            : `
              border-slate-200
              bg-white
              text-slate-700

              hover:bg-slate-50

              dark:border-white/10
              dark:bg-white/[0.03]
              dark:text-slate-200
              dark:hover:bg-white/[0.06]
            `
        }
      `}
    >
      {children}
    </button>
  );
}

// ======================================================
// RESULT BOX
// ======================================================

function ResultBox({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-white/10
        p-4
      "
    >
      <p
        className="
          text-xs
          text-white/70
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
        "
      >
        ₹{formatCurrency(value)}
      </p>
    </div>
  );
}

// ======================================================
// BREAKDOWN
// ======================================================

function Breakdown({
  label,
  value,
  last = false,
}: {
  label: string;

  value: number;

  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        py-3
        text-sm

        ${last ? "" : "border-b border-white/20"}
      `}
    >
      <span
        className="
          text-white/85
        "
      >
        {label}
      </span>

      <span
        className="
          shrink-0
          font-semibold
        "
      >
        ₹{formatCurrency(value)}
      </span>
    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        p-4

        dark:border-white/10
        dark:bg-white/[0.03]
      "
    >
      <p
        className="
          text-sm
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-xl
          font-bold
        "
      >
        ₹{formatCurrency(value)}
      </p>
    </div>
  );
}

// ======================================================
// CURRENCY
// ======================================================

function formatCurrency(value: number) {
  return Math.round(value || 0).toLocaleString("en-IN");
}
