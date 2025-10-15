export type FinancialProfile = {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  monthlyDebtPayment: number;
  currentSavings: number;
  monthlySavings: number;
  retirementAge: number;
  retirementSavings: number;
  emergencyFundGoal: number;
  dti: number;
  savingsRate: number;
  emergencyFundMonths: number;
  netWorthGrowth: number;
};

export type NetWorthDataPoint = {
  month: string;
  netWorth: number;
};