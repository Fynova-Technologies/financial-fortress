
import { RetirementData } from "../types";
import { formatCurrency } from "../utils";

export const defaultRetirementData: RetirementData = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  monthlyContribution: 500,
  expectedReturn: 7,
  inflationRate: 2.5,
  desiredMonthlyIncome: 5000,
};

export function calculateRetirement(retirementData: RetirementData) {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    inflationRate,
    desiredMonthlyIncome,
  } = retirementData;

  const yearsUntilRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const monthlyRate = expectedReturn / 100 / 12;
  const numMonthsUntilRetirement = yearsUntilRetirement * 12;

  let projectedSavings = currentSavings * Math.pow(1 + monthlyRate, numMonthsUntilRetirement);
  if (monthlyRate === 0) {
    projectedSavings += monthlyContribution * numMonthsUntilRetirement;
  } else {
    projectedSavings +=
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, numMonthsUntilRetirement) - 1) / monthlyRate);
  }

  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  const inflationAdjustedMonthlyIncome = desiredMonthlyIncome * inflationFactor;

  const annualWithdrawalRate = 0.04;
  const projectedMonthlyIncome = (projectedSavings * annualWithdrawalRate) / 12;

  const isGoalMet = projectedMonthlyIncome >= inflationAdjustedMonthlyIncome;
  const recommendations: string[] = [];

  if (!isGoalMet) {
    const additionalNeeded = inflationAdjustedMonthlyIncome - projectedMonthlyIncome;
    const additionalSavingsNeeded = (additionalNeeded * 12) / annualWithdrawalRate;
    const monthlyRateForCalc = monthlyRate;
    const denominator =
      monthlyRateForCalc === 0
        ? numMonthsUntilRetirement
        : (Math.pow(1 + monthlyRateForCalc, numMonthsUntilRetirement) - 1) / monthlyRateForCalc;
    const additionalMonthlySavingsNeeded = additionalSavingsNeeded / (denominator || 1);

    recommendations.push(
      `Increase your monthly contribution by ${formatCurrency(additionalMonthlySavingsNeeded)} to meet your retirement goal.`
    );
    recommendations.push(`Consider adjusting your investment strategy to pursue a higher return.`);
  } else {
    recommendations.push(`Your current savings plan is on track to meet your retirement goal.`);
    recommendations.push(`Consider setting aside extra savings for unexpected expenses in retirement.`);
  }

  recommendations.push(`Review your retirement plan annually to stay on track.`);
  recommendations.push(`Consider consulting a financial advisor for personalized advice.`);

  const chartData: Array<{ age: number; savings: number }> = [];
  let currentTotal = currentSavings;
  for (let year = currentAge; year <= retirementAge; year++) {
    currentTotal = currentTotal * (1 + expectedReturn / 100) + monthlyContribution * 12;
    chartData.push({ age: year, savings: currentTotal });
  }

  return {
    projectedSavings,
    yearsUntilRetirement,
    projectedMonthlyIncome,
    inflationAdjustedMonthlyIncome,
    isGoalMet,
    goalSummary: isGoalMet
      ? "Based on your current savings rate and expected return, you're projected to meet your retirement income goal."
      : "Your current savings plan may not be sufficient to meet your retirement income goal.",
    recommendations,
    chartData,
  };
}
