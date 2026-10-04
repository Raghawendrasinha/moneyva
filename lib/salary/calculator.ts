// lib/salary/calculator.ts

import {
  SalaryInput,
  SalaryStructureMode,
  PFMode,
  TaxYear,
  TaxRegime,
} from "./types";

import {
  calculateIncomeTax,
  calculateSurcharge,
  calculateCess,
} from "./tax";

import {
  EPF_RULES,
  DEFAULT_TAX_YEAR,
} from "./constants";


// ======================================================
// SALARY RESULT
// ======================================================

export interface SalaryResult {

  ctc: number;

  basicSalary: number;

  hra: number;

  specialAllowance: number;

  otherAllowances: number;

  variablePay: number;

  fixedGrossSalary: number;

  grossSalary: number;

  employeePF: number;

  employerPF: number;

  eps: number;

  gratuity: number;

  standardDeduction: number;

  taxableIncome: number;

  incomeTax: number;

  surcharge: number;

  cess: number;

  totalTax: number;

  annualTakeHome: number;

  monthlyFixedTakeHome: number;

  remainingCtc: number;

  mode: SalaryStructureMode;

  pfMode: PFMode;

  taxYear: TaxYear;
}


// ======================================================
// MAIN SALARY CALCULATOR
// ======================================================

export function calculateSalary(
  input: SalaryInput
): SalaryResult {

  const ctc = Math.max(
    0,
    input.ctc
  );

  const basicPercent = Math.min(
    100,
    Math.max(
      0,
      input.basicPercent
    )
  );

  const mode: SalaryStructureMode =
    input.mode ?? "simple";

  const pfMode: PFMode =
    input.pfMode ?? "standard";

  const taxYear: TaxYear =
    input.taxYear ?? DEFAULT_TAX_YEAR;


  // ====================================================
  // BASIC SALARY
  // ====================================================

  const basicSalary = Math.round(
    ctc *
      basicPercent /
      100
  );


  // ====================================================
  // VARIABLE PAY
  // ====================================================

  const variablePay = Math.max(
    0,
    input.variablePay || 0
  );


  // ====================================================
  // SIMPLE MODE
  // ====================================================

  if (mode === "simple") {

    return calculateSimpleMode({
      ...input,
      ctc,
      basicSalary,
      variablePay,
      pfMode,
      taxYear,
    });
  }


  // ====================================================
  // DETAILED MODE
  // ====================================================

  return calculateDetailedMode({
    ...input,
    ctc,
    basicSalary,
    variablePay,
    pfMode,
    taxYear,
  });
}


// ======================================================
// PF / EPS CALCULATION
// ======================================================

function calculatePF(
  basicSalary: number,
  input: SalaryInput,
  pfMode: PFMode,
  taxYear: TaxYear
): {
  employeePF: number;
  employerPF: number;
  eps: number;
} {


  // ====================================================
  // STANDARD PF
  // ====================================================

  if (pfMode === "standard") {

    const rules =
      EPF_RULES[taxYear];

    const monthlyBasic =
      basicSalary / 12;

    const monthlyPFWage =
      Math.min(
        monthlyBasic,
        rules.wageCeilingMonthly
      );


    // ==================================================
    // EMPLOYEE EPF
    // ==================================================

    const employeePFMonthly =
      monthlyPFWage *
      rules.employeeRate;


    // ==================================================
    // TOTAL EMPLOYER CONTRIBUTION
    // ==================================================

    const employerContributionMonthly =
      monthlyPFWage *
      rules.employerRate;


    // ==================================================
    // EPS
    // ==================================================

    const epsMonthly =
      Math.min(
        monthlyPFWage *
          rules.epsRate,

        rules.epsMaximumMonthly
      );


    // ==================================================
    // EMPLOYER EPF
    // ==================================================

    const employerPFMonthly =
      Math.max(
        0,
        employerContributionMonthly -
          epsMonthly
      );


    return {

      employeePF:
        Math.round(
          employeePFMonthly *
            12
        ),

      employerPF:
        Math.round(
          employerPFMonthly *
            12
        ),

      eps:
        Math.round(
          epsMonthly *
            12
        ),
    };
  }


  // ====================================================
  // ACTUAL PF
  // ====================================================

  if (pfMode === "actual") {

    const employeePF =
      Math.max(
        0,
        input.customEmployeePF ??
          0
      );

    const employerPF =
      Math.max(
        0,
        input.customEmployerPF ??
          input.employerPF ??
          employeePF
      );


    return {

      employeePF:
        Math.round(
          employeePF
        ),

      employerPF:
        Math.round(
          employerPF
        ),

      eps: 0,
    };
  }


  // ====================================================
  // CUSTOM PF
  // ====================================================

  const employeePF =
    Math.max(
      0,
      input.customEmployeePF ??
        0
    );

  const employerPF =
    Math.max(
      0,
      input.customEmployerPF ??
        input.employerPF ??
        employeePF
    );


  return {

    employeePF:
      Math.round(
        employeePF
      ),

    employerPF:
      Math.round(
        employerPF
      ),

    eps: 0,
  };
}


// ======================================================
// GRATUITY
// ======================================================

function calculateGratuity(
  basicSalary: number,
  input: SalaryInput
): number {


  // ====================================================
  // EXPLICIT GRATUITY ENTERED BY USER
  // ====================================================

  if (
    input.gratuity !== undefined
  ) {

    return Math.max(
      0,
      Math.round(
        input.gratuity
      )
    );
  }


  // ====================================================
  // DEFAULT GRATUITY PROVISION
  //
  // 4.81% of Basic Salary
  // ====================================================

  return Math.round(
    basicSalary *
      0.0481
  );
}


// ======================================================
// SIMPLE MODE
// ======================================================

function calculateSimpleMode(
  input: SalaryInput & {
    ctc: number;
    basicSalary: number;
    variablePay: number;
    pfMode: PFMode;
    taxYear: TaxYear;
  }
): SalaryResult {

  const {
    ctc,
    basicSalary,
    variablePay,
    hra,
    otherAllowances,
    taxRegime,
    pfMode,
    taxYear,
  } = input;


  // ====================================================
  // PF
  // ====================================================

  const {
    employeePF,
    employerPF,
    eps,
  } = calculatePF(
    basicSalary,
    input,
    pfMode,
    taxYear
  );


  // ====================================================
  // GRATUITY
  // ====================================================

  const gratuity =
    calculateGratuity(
      basicSalary,
      input
    );


  // ====================================================
  // FIXED GROSS
  // ====================================================

  const fixedGrossSalary =
    Math.max(
      0,
      ctc -
        employerPF -
        gratuity -
        variablePay
    );


  // ====================================================
  // GROSS SALARY
  // ====================================================

  const grossSalary =
    fixedGrossSalary +
    variablePay;


  // ====================================================
  // STANDARD DEDUCTION
  // ====================================================

  const standardDeduction =
    taxRegime === "new"
      ? 75000
      : 50000;


  // ====================================================
  // TAXABLE INCOME
  // ====================================================

  const taxableIncome =
    Math.max(
      0,
      grossSalary -
        standardDeduction
    );


  // ====================================================
  // INCOME TAX
  // ====================================================

  const incomeTax =
    calculateIncomeTax(
      taxableIncome,
      taxRegime,
      taxYear
    );


  // ====================================================
  // SURCHARGE
  // ====================================================

  const surcharge =
    calculateSurcharge(
      taxableIncome,
      incomeTax,
      taxRegime
    );


  // ====================================================
  // CESS
  // ====================================================

  const cess =
    calculateCess(
      incomeTax,
      surcharge
    );


  // ====================================================
  // TOTAL TAX
  // ====================================================

  const totalTax =
    incomeTax +
    surcharge +
    cess;


  // ====================================================
  // ANNUAL TAKE HOME
  // ====================================================

  const annualTakeHome =
    Math.max(
      0,
      grossSalary -
        employeePF -
        totalTax
    );


  // ====================================================
  // FIXED SALARY TAX
  // ====================================================

  const fixedSalaryTax =
    calculateTaxAllocatedToFixedSalary(
      grossSalary,
      variablePay,
      standardDeduction,
      taxRegime,
      taxYear
    );


  // ====================================================
  // ANNUAL FIXED TAKE HOME
  // ====================================================

  const annualFixedTakeHome =
    Math.max(
      0,
      fixedGrossSalary -
        employeePF -
        fixedSalaryTax
    );


  // ====================================================
  // MONTHLY FIXED TAKE HOME
  // ====================================================

  const monthlyFixedTakeHome =
    Math.round(
      annualFixedTakeHome /
        12
    );


  // ====================================================
  // REMAINING CTC
  // ====================================================

  const remainingCtc =
    Math.max(
      0,
      ctc -
        basicSalary -
        Math.max(
          0,
          hra || 0
        ) -
        Math.max(
          0,
          input.specialAllowance || 0
        ) -
        Math.max(
          0,
          otherAllowances || 0
        ) -
        variablePay -
        employerPF -
        gratuity
    );


  // ====================================================
  // RESULT
  // ====================================================

  return {

    ctc,

    basicSalary,

    hra:
      Math.max(
        0,
        hra || 0
      ),

    specialAllowance:
      Math.max(
        0,
        input.specialAllowance || 0
      ),

    otherAllowances:
      Math.max(
        0,
        otherAllowances || 0
      ),

    variablePay,

    fixedGrossSalary,

    grossSalary,

    employeePF,

    employerPF,

    eps,

    gratuity,

    standardDeduction,

    taxableIncome,

    incomeTax,

    surcharge,

    cess,

    totalTax,

    annualTakeHome,

    monthlyFixedTakeHome,

    remainingCtc,

    mode: "simple",

    pfMode,

    taxYear,
  };
}


// ======================================================
// DETAILED MODE
// ======================================================

function calculateDetailedMode(
  input: SalaryInput & {
    ctc: number;
    basicSalary: number;
    variablePay: number;
    pfMode: PFMode;
    taxYear: TaxYear;
  }
): SalaryResult {

  const {
    ctc,
    basicSalary,
    variablePay,
    hra,
    otherAllowances,
    taxRegime,
    pfMode,
    taxYear,
  } = input;


  // ====================================================
  // PF
  // ====================================================

  const {
    employeePF,
    employerPF,
    eps,
  } = calculatePF(
    basicSalary,
    input,
    pfMode,
    taxYear
  );


  // ====================================================
  // GRATUITY
  // ====================================================

  const gratuity =
    calculateGratuity(
      basicSalary,
      input
    );


  // ====================================================
  // HRA
  // ====================================================

  const safeHra =
    Math.max(
      0,
      hra || 0
    );


  // ====================================================
  // OTHER ALLOWANCES
  // ====================================================

  const safeOtherAllowances =
    Math.max(
      0,
      otherAllowances || 0
    );


  // ====================================================
  // SPECIAL ALLOWANCE
  // ====================================================

  const availableForSalary =
    ctc -
    employerPF -
    gratuity -
    variablePay;


  const specialAllowance =
    Math.max(
      0,
      availableForSalary -
        basicSalary -
        safeHra -
        safeOtherAllowances
    );


  // ====================================================
  // CTC COMPONENTS
  // ====================================================

  const calculatedCtc =
    basicSalary +
    safeHra +
    specialAllowance +
    safeOtherAllowances +
    variablePay +
    employerPF +
    gratuity;


  // ====================================================
  // FIXED GROSS
  // ====================================================

  const fixedGrossSalary =
    basicSalary +
    safeHra +
    specialAllowance +
    safeOtherAllowances;


  // ====================================================
  // GROSS SALARY
  // ====================================================

  const grossSalary =
    fixedGrossSalary +
    variablePay;


  // ====================================================
  // STANDARD DEDUCTION
  // ====================================================

  const standardDeduction =
    taxRegime === "new"
      ? 75000
      : 50000;


  // ====================================================
  // TAXABLE INCOME
  // ====================================================

  const taxableIncome =
    Math.max(
      0,
      grossSalary -
        standardDeduction
    );


  // ====================================================
  // INCOME TAX
  // ====================================================

  const incomeTax =
    calculateIncomeTax(
      taxableIncome,
      taxRegime,
      taxYear
    );


  // ====================================================
  // SURCHARGE
  // ====================================================

  const surcharge =
    calculateSurcharge(
      taxableIncome,
      incomeTax,
      taxRegime
    );


  // ====================================================
  // CESS
  // ====================================================

  const cess =
    calculateCess(
      incomeTax,
      surcharge
    );


  // ====================================================
  // TOTAL TAX
  // ====================================================

  const totalTax =
    incomeTax +
    surcharge +
    cess;


  // ====================================================
  // ANNUAL TAKE HOME
  // ====================================================

  const annualTakeHome =
    Math.max(
      0,
      grossSalary -
        employeePF -
        totalTax
    );


  // ====================================================
  // TAX ALLOCATED TO FIXED SALARY
  // ====================================================

  const fixedSalaryTax =
    allocateTaxToFixedSalary(
      totalTax,
      grossSalary,
      variablePay
    );


  // ====================================================
  // ANNUAL FIXED TAKE HOME
  // ====================================================

  const annualFixedTakeHome =
    Math.max(
      0,
      fixedGrossSalary -
        employeePF -
        fixedSalaryTax
    );


  // ====================================================
  // MONTHLY FIXED TAKE HOME
  // ====================================================

  const monthlyFixedTakeHome =
    Math.round(
      annualFixedTakeHome /
        12
    );


  // ====================================================
  // REMAINING CTC
  // ====================================================

  const remainingCtc =
    Math.round(
      ctc -
        calculatedCtc
    );


  // ====================================================
  // RESULT
  // ====================================================

  return {

    ctc,

    basicSalary,

    hra:
      safeHra,

    specialAllowance,

    otherAllowances:
      safeOtherAllowances,

    variablePay,

    fixedGrossSalary,

    grossSalary,

    employeePF,

    employerPF,

    eps,

    gratuity,

    standardDeduction,

    taxableIncome,

    incomeTax,

    surcharge,

    cess,

    totalTax,

    annualTakeHome,

    monthlyFixedTakeHome,

    remainingCtc,

    mode: "detailed",

    pfMode,

    taxYear,
  };
}


// ======================================================
// SIMPLE MODE TAX ALLOCATION
// ======================================================

function calculateTaxAllocatedToFixedSalary(
  grossSalary: number,
  variablePay: number,
  standardDeduction: number,
  taxRegime: TaxRegime,
  taxYear: TaxYear
): number {

  if (
    grossSalary <= 0
  ) {

    return 0;
  }


  const fixedGross =
    Math.max(
      0,
      grossSalary -
        variablePay
    );


  const fixedTaxableIncome =
    Math.max(
      0,
      fixedGross -
        standardDeduction
    );


  const fixedIncomeTax =
    calculateIncomeTax(
      fixedTaxableIncome,
      taxRegime,
      taxYear
    );


  const fixedSurcharge =
    calculateSurcharge(
      fixedTaxableIncome,
      fixedIncomeTax,
      taxRegime
    );


  const fixedCess =
    calculateCess(
      fixedIncomeTax,
      fixedSurcharge
    );


  return (
    fixedIncomeTax +
    fixedSurcharge +
    fixedCess
  );
}


// ======================================================
// DETAILED MODE TAX ALLOCATION
// ======================================================

function allocateTaxToFixedSalary(
  totalTax: number,
  grossSalary: number,
  variablePay: number
): number {

  if (
    totalTax <= 0 ||
    grossSalary <= 0
  ) {

    return 0;
  }


  const fixedGross =
    Math.max(
      0,
      grossSalary -
        variablePay
    );


  if (
    fixedGross <= 0
  ) {

    return 0;
  }


  const fixedRatio =
    fixedGross /
    grossSalary;


  return Math.round(
    totalTax *
      fixedRatio
  );
}