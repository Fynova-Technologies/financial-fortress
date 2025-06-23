import type { AmortizationRow, YearlyAmortizationRow } from "@/types";

export function groupByYear(amortizationSchedule: AmortizationRow[]): YearlyAmortizationRow[] {
  const yearlySchedule: YearlyAmortizationRow[] = [];

  for (let i = 0; i < amortizationSchedule.length; i += 12) {
    const yearGroup = amortizationSchedule.slice(i, i + 12);
    const year = Math.floor(i / 12) + 1;
    // dummy changes

    // dummy changes


    const principal = yearGroup.reduce((sum, row) => sum + row.principal, 0);
    const interest = yearGroup.reduce((sum, row) => sum + row.interest, 0);
    const balance = yearGroup[yearGroup.length - 1]?.balance || 0;

    yearlySchedule.push({
      year,
      principal,
      interest,
      balance,
    });
  }

  return yearlySchedule;
}
