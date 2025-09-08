export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // yyyy-mm-dd
  contributionType: 'daily' | 'monthly' | 'quarterly' | 'annually';
  // optional runtime fields:
  userContribution?: number;
}
