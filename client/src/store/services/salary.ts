
import { SalaryData } from "../types";

export const defaultSalaryData: SalaryData = {
  grossSalary: 75000,
  taxRate: 25,
  deductions: 5000,
  bonuses: 2000,
  period: "annual",
};

export function calculateSalary(salaryData: SalaryData) {
  const { grossSalary, taxRate, deductions, bonuses, period } = salaryData;
  const annualGrossSalary = period === "monthly" ? grossSalary * 12 : grossSalary;
  const annualBonuses = bonuses;
  const annualDeductions = deductions;

  const taxAmount = (annualGrossSalary * taxRate) / 100;
  const annualNetSalary = annualGrossSalary - taxAmount - annualDeductions + annualBonuses;
  const monthlyNetSalary = annualNetSalary / 12;
  const biweeklyNetPay = annualNetSalary / 26;
  const weeklyNetPay = annualNetSalary / 52;

  const breakdown = [
    { category: "Gross Salary", amount: annualGrossSalary },
    { category: "Tax", amount: -taxAmount },
    { category: "Deductions", amount: -annualDeductions },
    { category: "Bonuses", amount: annualBonuses },
    { category: "Net Salary", amount: annualNetSalary },
  ];

  const chartData = [
    { name: "Take-home Pay", value: annualNetSalary },
    { name: "Tax", value: taxAmount },
    { name: "Deductions", value: annualDeductions },
  ];

  return {
    annualGrossSalary,
    annualNetSalary,
    monthlyNetSalary,
    biweeklyNetPay,
    weeklyNetPay,
    taxAmount,
    breakdown,
    chartData,
  };
}
