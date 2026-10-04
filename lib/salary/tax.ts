// lib/salary/tax.ts

import { TaxRegime, TaxYear } from "./types";


// ======================================================
// TAX CONSTANTS
// AY 2026-27
// ======================================================

const NEW_REGIME_87A_LIMIT = 12_00_000;
const NEW_REGIME_87A_REBATE = 60_000;

const OLD_REGIME_87A_LIMIT = 5_00_000;
const OLD_REGIME_87A_REBATE = 12_500;

const CESS_RATE = 0.04;


// ======================================================
// MAIN INCOME TAX CALCULATOR
// ======================================================

export function calculateIncomeTax(
  taxableIncome: number,
  regime: TaxRegime,
  taxYear?: TaxYear
): number {

  const income = Math.max(
    0,
    taxableIncome
  );


  // Currently supporting AY 2026-27.
  //
  // Keeping taxYear optional preserves compatibility
  // with existing calculator.ts calls.

  if (regime === "new") {

    return calculateNewRegimeTax(
      income
    );
  }


  return calculateOldRegimeTax(
    income
  );
}


// ======================================================
// NEW REGIME
// AY 2026-27
//
// Official slabs:
//
// Up to 4L       0%
// 4L - 8L        5%
// 8L - 12L       10%
// 12L - 16L      15%
// 16L - 20L      20%
// 20L - 24L      25%
// Above 24L      30%
// ======================================================

function calculateNewRegimeTax(
  taxableIncome: number
): number {

  let tax = 0;


  // ----------------------------------------------------
  // ₹0 - ₹4,00,000
  // ----------------------------------------------------

  if (
    taxableIncome <= 4_00_000
  ) {

    tax = 0;

  }


  // ----------------------------------------------------
  // ₹4L - ₹8L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 8_00_000
  ) {

    tax =
      (
        taxableIncome -
        4_00_000
      ) * 0.05;

  }


  // ----------------------------------------------------
  // ₹8L - ₹12L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 12_00_000
  ) {

    tax =
      20_000 +
      (
        taxableIncome -
        8_00_000
      ) * 0.10;

  }


  // ----------------------------------------------------
  // ₹12L - ₹16L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 16_00_000
  ) {

    tax =
      60_000 +
      (
        taxableIncome -
        12_00_000
      ) * 0.15;

  }


  // ----------------------------------------------------
  // ₹16L - ₹20L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 20_00_000
  ) {

    tax =
      1_20_000 +
      (
        taxableIncome -
        16_00_000
      ) * 0.20;

  }


  // ----------------------------------------------------
  // ₹20L - ₹24L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 24_00_000
  ) {

    tax =
      2_00_000 +
      (
        taxableIncome -
        20_00_000
      ) * 0.25;

  }


  // ----------------------------------------------------
  // Above ₹24L
  // ----------------------------------------------------

  else {

    tax =
      3_00_000 +
      (
        taxableIncome -
        24_00_000
      ) * 0.30;

  }


  // ====================================================
  // SECTION 87A REBATE
  // ====================================================
  //
  // Resident individual:
  //
  // Taxable income <= ₹12L
  // Maximum rebate = ₹60,000
  //
  // Rebate cannot make tax negative.
  // ====================================================

  if (
    taxableIncome <=
    NEW_REGIME_87A_LIMIT
  ) {

    tax = Math.max(
      0,
      tax -
        NEW_REGIME_87A_REBATE
    );

  }


  // ====================================================
  // MARGINAL RELIEF
  // ====================================================
  //
  // For income just above ₹12L:
  //
  // Tax should not exceed the amount
  // by which income exceeds ₹12L.
  //
  // Example:
  //
  // Income = ₹12,00,001
  // Normal tax = ₹60,000
  // Maximum tax after marginal relief = ₹1
  //
  // Marginal relief applies until normal tax
  // becomes lower than the excess income.
  // ====================================================

  else {

    const excessIncome =
      taxableIncome -
      NEW_REGIME_87A_LIMIT;


    const taxAfterMarginalRelief =
      Math.min(
        tax,
        excessIncome
      );


    tax =
      taxAfterMarginalRelief;
  }


  return Math.max(
    0,
    Math.round(tax)
  );
}


// ======================================================
// OLD REGIME
// AY 2026-27
//
// Individual below 60:
//
// Up to ₹2.5L      0%
// ₹2.5L - ₹5L      5%
// ₹5L - ₹10L       20%
// Above ₹10L       30%
// ======================================================

function calculateOldRegimeTax(
  taxableIncome: number
): number {

  let tax = 0;


  // ----------------------------------------------------
  // Up to ₹2,50,000
  // ----------------------------------------------------

  if (
    taxableIncome <= 2_50_000
  ) {

    tax = 0;

  }


  // ----------------------------------------------------
  // ₹2.5L - ₹5L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 5_00_000
  ) {

    tax =
      (
        taxableIncome -
        2_50_000
      ) * 0.05;

  }


  // ----------------------------------------------------
  // ₹5L - ₹10L
  // ----------------------------------------------------

  else if (
    taxableIncome <= 10_00_000
  ) {

    tax =
      12_500 +
      (
        taxableIncome -
        5_00_000
      ) * 0.20;

  }


  // ----------------------------------------------------
  // Above ₹10L
  // ----------------------------------------------------

  else {

    tax =
      1_12_500 +
      (
        taxableIncome -
        10_00_000
      ) * 0.30;

  }


  // ====================================================
  // SECTION 87A
  // ====================================================
  //
  // Old regime:
  //
  // Taxable income <= ₹5L
  // Maximum rebate = ₹12,500
  // ====================================================

  if (
    taxableIncome <=
    OLD_REGIME_87A_LIMIT
  ) {

    tax = Math.max(
      0,
      tax -
        OLD_REGIME_87A_REBATE
    );

  }


  return Math.max(
    0,
    Math.round(tax)
  );
}


// ======================================================
// SURCHARGE
// ======================================================
//
// This helper calculates surcharge separately.
//
// It is intentionally NOT added to calculateIncomeTax()
// yet because your current SalaryResult has separate
// Income Tax and Cess fields.
//
// This lets us add a dedicated Surcharge field next,
// without silently changing the meaning of your current
// "Income Tax" number.
// ======================================================

export function calculateSurcharge(
  taxableIncome: number,
  incomeTax: number,
  regime: TaxRegime
): number {

  const income =
    Math.max(
      0,
      taxableIncome
    );

  const tax =
    Math.max(
      0,
      incomeTax
    );


  let surchargeRate = 0;


  // ----------------------------------------------------
  // New regime
  //
  // Up to ₹50L       0%
  // ₹50L - ₹1Cr      10%
  // ₹1Cr - ₹2Cr      15%
  // Above ₹2Cr       25%
  // ----------------------------------------------------

  if (regime === "new") {

    if (
      income > 2_00_00_000
    ) {

      surchargeRate = 0.25;

    } else if (
      income > 1_00_00_000
    ) {

      surchargeRate = 0.15;

    } else if (
      income > 50_00_000
    ) {

      surchargeRate = 0.10;

    }

  }


  // ----------------------------------------------------
  // Old regime
  //
  // Up to ₹50L       0%
  // ₹50L - ₹1Cr      10%
  // ₹1Cr - ₹2Cr      15%
  // ₹2Cr - ₹5Cr      25%
  // Above ₹5Cr       37%
  // ----------------------------------------------------

  else {

    if (
      income > 5_00_00_000
    ) {

      surchargeRate = 0.37;

    } else if (
      income > 2_00_00_000
    ) {

      surchargeRate = 0.25;

    } else if (
      income > 1_00_00_000
    ) {

      surchargeRate = 0.15;

    } else if (
      income > 50_00_000
    ) {

      surchargeRate = 0.10;

    }

  }


  return Math.round(
    tax *
      surchargeRate
  );
}


// ======================================================
// HEALTH & EDUCATION CESS
// ======================================================
//
// Cess = 4% of:
//
// Income Tax + Surcharge
//
// The current calculator passes only income tax,
// so this function accepts an optional surcharge.
//
// ======================================================

export function calculateCess(
  incomeTax: number,
  surcharge: number = 0
): number {

  const tax =
    Math.max(
      0,
      incomeTax
    );

  const surchargeAmount =
    Math.max(
      0,
      surcharge
    );


  return Math.round(
    (
      tax +
      surchargeAmount
    ) *
      CESS_RATE
  );
}