import { desc } from "drizzle-orm";

// Route definitions
export const routes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "fa-home",
    mobileLabel: "Home",
    description: "Your financial overview",
  },
  {
    path: "/Calculators",
    label: "Calculators",
    icon: "fa-calculator",
    mobileLabel: "Calc",
    description: "Financial calculation tools",
  },
  {
    path: "/savings-tracker",
    label: "Goal Tracker",
    icon: "fa-piggy-bank",
    description: "Track your savings and goals",
  },
  {
    path: "/Advisory",
    label: "Advisory",
    icon: "fa-message",
    description: "Get financial advice tailored to your philosophy"
  },
  {
    path: "/reports",
    label: "Reports",
    icon: "fa-chart-line",
    description: "Detailed financial reports",
  },
  {
    path: "/scenarios",
    label: "Scenarios",
    icon: "fa-lightbulb",
    description: "Explore financial what-if scenarios",
  },
  {
    path: "/alerts",
    label: "Alerts",
    icon: "fa-bell",
    description: "Important notifications and alerts",
  }
];

// Data model types
export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
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
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
}

export interface EMIData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  termType: 'years' | 'months';
  startDate: string;
}

export interface RetirementData {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredMonthlyIncome: number;
}

export interface SalaryData {
  grossSalary: number;
  taxRate: number;
  deductions: number;
  bonuses: number;
  period: 'monthly' | 'annual';
}

export interface ROIData {
  initialInvestment: number;
  additionalContribution: number;
  contributionFrequency: 'monthly' | 'quarterly' | 'annual';
  annualRate: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  investmentTerm: number;
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
  currentAmount: number;
  targetDate: string;
  contributionType: 'daily' | 'monthly' | 'quarterly' | 'annually';
}

export interface SavingsData {
  savingsGoals: SavingsGoal[];
  monthlySavings: number;
}

export interface CalculatedGoalResult extends SavingsGoal {
  monthsRemaining: number;
  periodsRemaining: number;
  monthlyNeeded: number; // Monthly equivalent for display
  neededContribution: number; // Actual contribution needed per period
  userContribution: number; // User's contribution per period
  monthlyUserContribution: number; // Monthly equivalent of user's contribution
  isAchievable: boolean;
  expectedCompletionDate: string;
  progressPercentage: number;
  isOnTrack: boolean;
  isCompleted: boolean;
}

export interface SavingsCalculationResult {
  goalResults: CalculatedGoalResult[];
  totalSaved: number;
  totalTarget: number;
  totalMonthlyNeeded: number; // Total monthly equivalent needed across all goals
  chartData: Array<{
    month: number;
    date: string;
    goals: Array<{ id: string; name: string; amount: number }>;
  }>;
}

export interface CalculationResult {
  monthlyPayment?: number;
  totalInterest?: number;
  totalPayment?: number;
  scheduleData?: any[];
  chartData?: any[];
  isGoalMet?: boolean;
  projectedAmount?: number;
  [key: string]: any;
}

export interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearlyAmortizationRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}
