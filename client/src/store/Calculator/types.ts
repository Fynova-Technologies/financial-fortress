
export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  color?: string;
  category_id: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date?: string;
  notes?: string;
  description: string;
}

export interface BudgetData {
  totalIncome: number;
  totalExpenses: number;
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
}

export interface MortgageData {
  homePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanTerm: number; // years
  interestRate: number; // annual %
  propertyTax: number; // annual amount
  homeInsurance: number; // annual amount
  pmi: number; // annual %
}

export interface EMIData {
  loanAmount: number;
  interestRate: number; // annual %
  loanTerm: number; // number (years or months depends on termType)
  termType: "years" | "months";
  startDate: string; // YYYY-MM-DD
}

export interface RetirementData {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number; // annual %
  inflationRate: number; // annual %
  desiredMonthlyIncome: number;
}

export interface SalaryData {
  grossSalary: number;
  taxRate: number;
  deductions: number;
  bonuses: number;
  period: "annual" | "monthly";
}

export interface ROIData {
  initialInvestment: number;
  additionalContribution: number;
  contributionFrequency: "monthly" | "quarterly" | "annual" | "none";
  annualRate: number;
  compoundingFrequency: "daily" | "monthly" | "quarterly" | "annually";
  investmentTerm: number; // years
}

export interface CurrencyData {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  contributionType: "daily" | "monthly" | "quarterly" | "annually";
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
}

export interface SavingsData {
  savingsGoals: SavingsGoal[];
  moneySavings: number;
}

export type CalculationResult = Record<string, any>;
