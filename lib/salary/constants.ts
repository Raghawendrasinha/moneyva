// lib/salary/constants.ts

// ======================================================
// EPF / EPS RULES
// Applicable from 17 September 2026
// ======================================================

export const EPF_RULES = {
  "2026-27": {
    employeeRate: 0.12,

    employerRate: 0.12,

    // Revised statutory EPF wage ceiling
    // Effective 17 September 2026
    wageCeilingMonthly: 25000,

    // EPS contribution from employer share
    epsRate: 0.0833,

    // Maximum EPS contribution:
    // ₹25,000 × 8.33% ≈ ₹2,082.50
    // Rounded to ₹2,083
    epsMaximumMonthly: 2083,
  },
} as const;

export const DEFAULT_TAX_YEAR =
  "2026-27" as const;