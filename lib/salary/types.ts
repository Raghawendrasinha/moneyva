// lib/salary/types.ts

export type TaxRegime = "new" | "old";

export type SalaryStructureMode =
  | "simple"
  | "detailed";


// ==========================================
// PF CALCULATION MODE
// ==========================================

export type PFMode =
  | "standard"
  | "actual"
  | "custom";


// ==========================================
// TAX YEAR
// ==========================================

export type TaxYear =
  | "2026-27";


// ==========================================
// SALARY INPUT
// ==========================================

export interface SalaryInput {

  // Annual CTC
  ctc: number;


  // Basic salary as % of CTC
  basicPercent: number;


  // Annual HRA
  hra: number;


  // Annual special allowance
  //
  // In detailed mode this can be calculated
  // automatically by the calculator.
  specialAllowance: number;


  // Other annual allowances
  otherAllowances: number;


  // Annual variable / bonus
  variablePay: number;


  // Tax regime
  taxRegime: TaxRegime;


  // Simple / detailed salary structure
  mode?: SalaryStructureMode;


  // ========================================
  // PF
  // ========================================

  // PF calculation method
  pfMode?: PFMode;


  // Custom annual employee PF
  customEmployeePF?: number;


  // Custom annual employer PF
  customEmployerPF?: number;


  // Legacy/manual employer PF input
  //
  // Kept for compatibility with the current
  // calculator until calculator.ts is updated.
  employerPF?: number;


  // ========================================
  // GRATUITY
  // ========================================

  // Annual gratuity
  gratuity?: number;


  // ========================================
  // TAX YEAR
  // ========================================

  taxYear?: TaxYear;
}
