// Route definitions
export const routes = [
  {
    path: "/",
    label: "Dashboard",
    icon: "fa-home",
    mobileLabel: "Home",
    description: "Your financial overview",
  },
  {
    path: "/budget-planner",
    label: "Budget Planner",
    icon: "fa-wallet",
    mobileLabel: "Budget",
    description: "Track your income and expenses",
  },
  {
    path: "/mortgage-calculator",
    label: "Mortgage Calculator",
    icon: "fa-home",
    mobileLabel: "Mortgage",
    description: "Calculate your mortgage payments",
  },
  {
    path: "/emi-calculator",
    label: "EMI Calculator",
    icon: "fa-calculator",
    mobileLabel: "EMI",
    description: "Calculate loan EMI payments",
  },
  {
    path: "/retirement-planner",
    label: "Retirement Planner",
    icon: "fa-chart-line",
    mobileLabel: "Retire",
    description: "Plan for your retirement",
  },
  {
    path: "/salary-manager",
    label: "Salary Manager",
    icon: "fa-money-check-alt",
    description: "Analyze your salary and taxes",
  },
  {
    path: "/roi-calculator",
    label: "ROI Calculator",
    icon: "fa-chart-pie",
    description: "Calculate investment returns",
  },
  {
    path: "/currency-converter",
    label: "Currency Converter",
    icon: "fa-exchange-alt",
    description: "Convert between currencies",
  },
  {
    path: "/savings-tracker",
    label: "Savings Tracker",
    icon: "fa-piggy-bank",
    description: "Track your savings goals",
  },
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
}

export interface SavingsData {
  savingsGoals: SavingsGoal[];
  monthlySavings: number;
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

export interface RepaymentRow {
  
}