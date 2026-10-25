export type Regime = "new" | "old";

export type TaxResult = {
  standardDeduction: number;
  deductions: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
};

export function slabTax(income: number, regime: Regime): number {
  const amount = Math.max(0, Math.floor(income));

  if (regime === "new") {
    const slabs = [
      { limit: 400_000, rate: 0 },
      { limit: 800_000, rate: 0.05 },
      { limit: 1_200_000, rate: 0.10 },
      { limit: 1_600_000, rate: 0.15 },
      { limit: 2_000_000, rate: 0.20 },
      { limit: 2_400_000, rate: 0.25 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.30 },
    ];

    let tax = 0;
    let previous = 0;
    for (const slab of slabs) {
      const taxableInSlab = Math.max(
        0,
        Math.min(amount, slab.limit) - Math.max(previous, 0),
      );
      tax += taxableInSlab * slab.rate;
      previous = slab.limit;
      if (amount <= slab.limit) break;
    }
    return Math.round(tax);
  }

  if (amount <= 250_000) return 0;
  if (amount <= 500_000) return Math.round((amount - 250_000) * 0.05);
  if (amount <= 1_000_000) {
    return Math.round(12_500 + (amount - 500_000) * 0.20);
  }
  return Math.round(112_500 + (amount - 1_000_000) * 0.30);
}

export function calculateTax(
  grossSalary: number,
  regime: Regime,
  deductions: number,
  isResident: boolean,
): TaxResult {
  if (!Number.isFinite(grossSalary) || grossSalary < 0 || grossSalary > 5_000_000) {
    throw new RangeError("Gross salary must be between ₹0 and ₹50 lakh for this simplified calculator.");
  }
  if (!Number.isFinite(deductions) || deductions < 0) {
    throw new RangeError("Deductions must be a finite, non-negative number.");
  }

  const standardDeduction = Math.min(grossSalary, regime === "new" ? 75_000 : 50_000);
  const allowedDeductions = regime === "new" ? 0 : deductions;
  // Compute tax using the unrounded income; round the final amount payable below.
  const taxableIncome = Math.max(
    0,
    grossSalary - standardDeduction - allowedDeductions,
  );

  let incomeTax = slabTax(taxableIncome, regime);

  if (isResident && regime === "new" && taxableIncome <= 1_200_000) {
    incomeTax = 0;
  } else if (isResident && regime === "new" && taxableIncome > 1_200_000) {
    // Marginal relief: tax cannot exceed income above ₹12 lakh.
    incomeTax = Math.min(incomeTax, taxableIncome - 1_200_000);
  } else if (isResident && regime === "old" && taxableIncome <= 500_000) {
    incomeTax = 0;
  }

  incomeTax = Math.max(0, Math.round(incomeTax));
  const cess = Math.round(incomeTax * 0.04);

  return {
    standardDeduction,
    deductions: allowedDeductions,
    taxableIncome,
    incomeTax,
    cess,
    // Round the final estimated amount payable to the nearest ₹10.
    totalTax: Math.round((incomeTax + cess) / 10) * 10,
  };
}
