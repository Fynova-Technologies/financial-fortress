
import { EMIData } from "../types";

export const defaultEMIData: EMIData = {
  loanAmount: 25000,
  interestRate: 8.5,
  loanTerm: 5,
  termType: "years",
  startDate: new Date().toISOString().split("T")[0],
};

export function calculateEMI(emiData: EMIData) {
  const { loanAmount, interestRate, loanTerm, termType, startDate } = emiData;
  const termMonths = termType === "years" ? loanTerm * 12 : loanTerm;
  const monthlyRate = interestRate / 100 / 12;

  let monthlyEMI = 0;
  if (monthlyRate === 0) monthlyEMI = loanAmount / termMonths;
  else
    monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPayment = monthlyEMI * termMonths;
  const totalInterest = totalPayment - loanAmount;

  const repaymentSchedule: Array<{
    number: number;
    date: string;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }> = [];

  let remainingBalance = loanAmount;
  const startDateObj = new Date(startDate);
  for (let i = 1; i <= termMonths; i++) {
    const date = new Date(startDateObj);
    date.setMonth(startDateObj.getMonth() + i);

    const monthlyInterest = remainingBalance * monthlyRate;
    const monthlyPrincipal = monthlyEMI - monthlyInterest;
    remainingBalance -= monthlyPrincipal;

    repaymentSchedule.push({
      number: i,
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
      emi: monthlyEMI,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      balance: Math.max(0, remainingBalance),
    });
  }

  const chartData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
    repaymentSchedule,
    chartData,
  };
}
