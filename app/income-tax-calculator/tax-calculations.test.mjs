import test from "node:test";
import assert from "node:assert/strict";
import { calculateTax, slabTax } from "../../.tmp-tax-tests/tax-calculations.js";

test("new regime: ₹12 lakh taxable income qualifies for rebate", () => {
  const result = calculateTax(12_75_000, "new", 0, true);
  assert.equal(result.taxableIncome, 12_00_000);
  assert.equal(result.incomeTax, 0);
  assert.equal(result.totalTax, 0);
});

test("new regime: marginal relief applies just above ₹12 lakh", () => {
  const result = calculateTax(12_75_010, "new", 0, true);
  assert.equal(result.taxableIncome, 12_00_010);
  assert.equal(result.incomeTax, 10);
  assert.equal(result.cess, 0);
  assert.equal(result.totalTax, 10);
});

test("old regime: ₹5 lakh taxable income qualifies for rebate", () => {
  const result = calculateTax(5_50_000, "old", 0, true);
  assert.equal(result.taxableIncome, 5_00_000);
  assert.equal(result.incomeTax, 0);
  assert.equal(result.totalTax, 0);
});

test("non-resident does not receive the resident rebate in this model", () => {
  const result = calculateTax(12_75_000, "new", 0, false);
  assert.equal(result.taxableIncome, 12_00_000);
  assert.ok(result.incomeTax > 0);
});

test("new regime ignores old-regime deductions", () => {
  const result = calculateTax(10_00_000, "new", 1_00_000, true);
  assert.equal(result.deductions, 0);
  assert.equal(result.taxableIncome, 9_25_000);
});

test("new regime: tax at ₹16 lakh taxable income follows the slab rates", () => {
  assert.equal(slabTax(16_00_000, "new"), 1_20_000);
});

test("new regime: tax at ₹24 lakh taxable income follows the slab rates", () => {
  assert.equal(slabTax(24_00_000, "new"), 3_00_000);
});

test("old regime: tax at ₹5 lakh and ₹10 lakh follows the slab rates", () => {
  assert.equal(slabTax(5_00_000, "old"), 12_500);
  assert.equal(slabTax(10_00_000, "old"), 1_12_500);
});

test("old regime: 4% cess is applied to non-zero income tax", () => {
  const result = calculateTax(10_50_000, "old", 0, false);
  assert.equal(result.taxableIncome, 10_00_000);
  assert.equal(result.incomeTax, 1_12_500);
  assert.equal(result.cess, 4_500);
  assert.equal(result.totalTax, 1_17_000);
});

test("taxable income retains precision before calculating tax", () => {
  const result = calculateTax(10_50_014, "old", 0, false);
  assert.equal(result.taxableIncome, 10_00_014);
  assert.equal(result.incomeTax, 1_12_504);
  assert.equal(result.cess, 4_500);
  assert.equal(result.totalTax % 10, 0);
});

test("official old-regime report scenario matches tax and final payable rounding", () => {
  const result = calculateTax(10_50_017, "old", 0, false);
  assert.equal(result.taxableIncome, 10_00_017);
  assert.equal(result.incomeTax, 1_12_505);
  assert.equal(result.cess, 4_500);
  assert.equal(result.totalTax, 1_17_010);
  assert.equal(result.totalTax % 10, 0);
});

test("official ₹8,00,017 old-regime report matches tax and final payable rounding", () => {
  const result = calculateTax(8_50_017, "old", 0, false);
  assert.equal(result.taxableIncome, 8_00_017);
  assert.equal(result.incomeTax, 72_503);
  assert.equal(result.cess, 2_900);
  assert.equal(result.totalTax, 75_400);
  assert.equal(result.totalTax % 10, 0);
});

test("negative gross salary is rejected", () => {
  assert.throws(
    () => calculateTax(-1, "new", 0, true),
    RangeError,
  );
});

test("negative or non-finite deductions are rejected", () => {
  assert.throws(() => calculateTax(10_00_000, "old", -1, true), RangeError);
  assert.throws(() => calculateTax(10_00_000, "old", Infinity, true), RangeError);
});

test("new regime: ₹12.5 lakh taxable income matches official calculator", () => {
  const result = calculateTax(13_25_000, "new", 0, true);
  assert.equal(result.taxableIncome, 12_50_000);
  assert.equal(result.incomeTax, 50_000);
  assert.equal(result.cess, 2_000);
  assert.equal(result.totalTax, 52_000);
});

test("new regime: marginal relief at ₹12.1 lakh taxable income, plus cess", () => {
  const result = calculateTax(12_85_000, "new", 0, true);
  assert.equal(result.taxableIncome, 12_10_000);
  assert.equal(result.incomeTax, 10_000);
  assert.equal(result.cess, 400);
  assert.equal(result.totalTax, 10_400);
});

test("standard deduction does not exceed gross salary in either regime", () => {
  const newRegime = calculateTax(40_000, "new", 0, true);
  const oldRegime = calculateTax(40_000, "old", 0, true);

  assert.equal(newRegime.standardDeduction, 40_000);
  assert.equal(newRegime.taxableIncome, 0);
  assert.equal(newRegime.totalTax, 0);

  assert.equal(oldRegime.standardDeduction, 40_000);
  assert.equal(oldRegime.taxableIncome, 0);
  assert.equal(oldRegime.totalTax, 0);
});


test("gross salary above ₹50 lakh is rejected because surcharge is not modelled", () => {
  assert.throws(
    () => calculateTax(5_000_001, "new", 0, true),
    RangeError,
  );
});


// Regression scenarios for resident individuals below age 60.
// Salary income only, no additional deductions.
// Expected values are regression baselines, not live official-portal results.
test("reference salary scenarios match expected taxable income and total tax", async (t) => {
  const cases = [
    [500_000,  "new", 425_000,       0],
    [500_000,  "old", 450_000,       0],
    [800_000,  "new", 725_000,       0],
    [800_000,  "old", 750_000,  65_000],
    [1_200_000, "new", 1_125_000,       0],
    [1_200_000, "old", 1_150_000, 163_800],
    [1_275_000, "new", 1_200_000,       0],
    [1_275_000, "old", 1_225_000, 187_200],
    [1_500_000, "new", 1_425_000,  97_500],
    [1_500_000, "old", 1_450_000, 257_400],
    [2_000_000, "new", 1_925_000, 192_400],
    [2_000_000, "old", 1_950_000, 413_400],
    [5_000_000, "new", 4_925_000, 1_099_800],
    [5_000_000, "old", 4_950_000, 1_349_400],
  ];

  for (const [salary, regime, expectedTaxableIncome, expectedTotalTax] of cases) {
    await t.test(`${regime} regime at gross salary ₹${salary}`, () => {
      const result = calculateTax(salary, regime, 0, true);
      assert.equal(result.taxableIncome, expectedTaxableIncome);
      assert.equal(result.totalTax, expectedTotalTax);
    });
  }
});
