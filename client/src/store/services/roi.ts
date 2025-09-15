
import { ROIData } from "../types";

export const defaultROIData: ROIData = {
  initialInvestment: 10000,
  additionalContribution: 500,
  contributionFrequency: "monthly",
  annualRate: 8,
  compoundingFrequency: "monthly",
  investmentTerm: 10,
};

export function calculateROI(roiData: ROIData) {
  const {
    initialInvestment,
    additionalContribution,
    contributionFrequency,
    annualRate,
    compoundingFrequency,
    investmentTerm,
  } = roiData;

  let periodsPerYear = 1;
  switch (compoundingFrequency) {
    case "daily":
      periodsPerYear = 365;
      break;
    case "monthly":
      periodsPerYear = 12;
      break;
    case "quarterly":
      periodsPerYear = 4;
      break;
    case "annually":
      periodsPerYear = 1;
      break;
  }

  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  const totalPeriods = periodsPerYear * investmentTerm;

  let contributionsPerYear = 0;
  switch (contributionFrequency) {
    case "monthly":
      contributionsPerYear = 12;
      break;
    case "quarterly":
      contributionsPerYear = 4;
      break;
    case "annual":
      contributionsPerYear = 1;
      break;
    case "none":
      contributionsPerYear = 0;
      break;
  }

  const contributionPerPeriod = additionalContribution * (contributionsPerYear / periodsPerYear);

  let finalValue = initialInvestment;
  let interestEarned = 0;
  let totalContributions = initialInvestment;

  const chartData: Array<{ year: number; amount: number }> = [];
  chartData.push({ year: 0, amount: initialInvestment });

  for (let year = 1; year <= investmentTerm; year++) {
    for (let period = 1; period <= periodsPerYear; period++) {
      const interestThisPeriod = finalValue * ratePerPeriod;
      interestEarned += interestThisPeriod;
      finalValue += interestThisPeriod;

      if (
        contributionsPerYear > 0 &&
        (period % (periodsPerYear / contributionsPerYear) === 0 ||
          contributionsPerYear > periodsPerYear)
      ) {
        finalValue += contributionPerPeriod;
        totalContributions += contributionPerPeriod;
      }
    }
    chartData.push({ year, amount: finalValue });
  }

  const totalAdditionalContributions = totalContributions - initialInvestment;
  const roi = ((finalValue - totalContributions) / totalContributions) * 100;

  return {
    finalValue,
    interestEarned,
    totalContributions,
    totalAdditionalContributions,
    roi,
    chartData,
  };
}
