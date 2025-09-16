
import { MortgageData } from "../types";

export const defaultMortgageData: MortgageData = {
  homePrice: 10,
  downPaymentPercent: 10,
  downPaymentAmount: 10,
  loanTerm: 10,
  interestRate: 10,
  propertyTax: 10,
  homeInsurance: 10,
  pmi: 10,
};

export function normalizeMortgageInput(data: Partial<MortgageData>, prev: MortgageData): MortgageData {
  // ensure down payment percent/amount are consistent
  const copy = { ...prev, ...data };
  if (data.homePrice !== undefined && data.downPaymentPercent !== undefined) {
    copy.downPaymentAmount = copy.homePrice * (copy.downPaymentPercent / 100);
  } else if (data.homePrice !== undefined && data.downPaymentAmount !== undefined) {
    copy.downPaymentPercent = (copy.downPaymentAmount / copy.homePrice) * 100;
  } else if (data.downPaymentPercent !== undefined && prev.homePrice) {
    copy.downPaymentAmount = prev.homePrice * (data.downPaymentPercent / 100);
  } else if (data.downPaymentAmount !== undefined && prev.homePrice) {
    copy.downPaymentPercent = (data.downPaymentAmount / prev.homePrice) * 100;
  }
  return copy;
}

export function calculateMortgage(mortgageData: MortgageData) {
  const {
    homePrice,
    downPaymentAmount,
    loanTerm,
    interestRate,
    propertyTax,
    homeInsurance,
    pmi,
  } = mortgageData;

  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  // monthly principal + interest
  let monthlyPayment = 0;
  if (monthlyRate === 0) monthlyPayment = loanAmount / totalPayments;
  else
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // PMI
  const downPaymentPercent = (downPaymentAmount / homePrice) * 100;
  const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * (pmi / 100)) / 12 : 0;

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
  const totalInterest = monthlyPayment * totalPayments - loanAmount;
  const totalCost = totalMonthlyPayment * totalPayments;

  const amortizationSchedule: Array<{ year: number; principal: number; interest: number; balance: number; }> = [];
  let remainingBalance = loanAmount;
  for (let year = 1; year <= loanTerm; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    for (let month = 1; month <= 12; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = monthlyPayment - monthlyInterest;
      yearlyInterest += monthlyInterest;
      yearlyPrincipal += monthlyPrincipal;
      remainingBalance -= monthlyPrincipal;
    }
    amortizationSchedule.push({
      year,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      balance: Math.max(0, remainingBalance),
    });
  }

  const chartData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
    { name: "Property Tax", value: propertyTax * loanTerm },
    { name: "Insurance", value: homeInsurance * loanTerm },
  ];

  if (monthlyPMI > 0) {
    chartData.push({ name: "PMI", value: monthlyPMI * 12 * loanTerm });
  }

  return {
    loanAmount,
    monthlyPayment,
    totalMonthlyPayment,
    totalInterest,
    totalCost,
    amortizationSchedule,
    chartData,
  };
}

export const updateMortgageDataImpl = (
  prev: MortgageData,
  partial: Partial<MortgageData>
): MortgageData => {
  return { ...prev, ...partial };
}
