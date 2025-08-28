import { SavingsData } from "../types";

export const defaultSavingsData: SavingsData = {
  savingsGoals: [],
  moneySavings: 0,
};

// Helper function to normalize savings to monthly equivalent for projections
function normalizeMonthlySavings(amount: number, contributionType: string): number {
  switch (contributionType) {
    case "daily":
      return amount * 30.44; // Average days per month
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "annually":
      return amount / 12;
    default:
      return amount;
  }
}

// Helper function to denormalize monthly savings to specific contribution type
function denormalizeSavings(monthlyAmount: number, contributionType: string): number {
  switch (contributionType) {
    case "daily":
      return monthlyAmount / 30.44; // Average days per month
    case "monthly":
      return monthlyAmount;
    case "quarterly":
      return monthlyAmount * 3;
    case "annually":
      return monthlyAmount * 12;
    default:
      return monthlyAmount;
  }
}

export function calculateSavings(savingsData: SavingsData) {
  const { savingsGoals, moneySavings } = savingsData;

  const goalResults = savingsGoals?.map((goal) => {
    const target_date = new Date(goal.targetDate);
    const current_date = new Date();

    // Calculate months remaining (for display purposes)
    const monthsRemaining = Math.max(0,
      (target_date.getFullYear() - current_date.getFullYear()) * 12 +
      (target_date.getMonth() - current_date.getMonth())
    );

    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

    // Calculate number of periods remaining depending on contribution type
    let periodsRemaining = 1;
    switch (goal.contributionType) {
      case "daily":
        periodsRemaining = Math.max(
          1,
          Math.ceil(
            (target_date.getTime() - current_date.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );
        break;
      case "monthly":
        periodsRemaining = Math.max(1, monthsRemaining);
        break;
      case "quarterly":
        periodsRemaining = Math.max(
          1,
          Math.ceil(monthsRemaining / 3)
        );
        break;
      case "annually":
        periodsRemaining = Math.max(
          1,
          Math.ceil(monthsRemaining / 12)
        );
        break;
    }

    // Calculate needed contribution per period based on contribution type
    const neededContribution = periodsRemaining > 0 ? remainingAmount / periodsRemaining : 0;
    
    // User's actual contribution (already in the selected type)
    const userContribution = moneySavings;
    const isAchievable = userContribution >= neededContribution;

    // Calculate monthly equivalent for projection calculations
    const monthlyNeeded = denormalizeSavings(neededContribution, goal.contributionType);
    const monthlyUserContribution = normalizeMonthlySavings(userContribution, goal.contributionType);

    // Calculate expected completion date based on current contribution rate
    let expectedCompletionDate = new Date(current_date);
    if (monthlyUserContribution > 0 && remainingAmount > 0) {
      const monthsToCompletion = Math.ceil(remainingAmount / monthlyUserContribution);
      expectedCompletionDate.setMonth(
        current_date.getMonth() + monthsToCompletion
      );
    } else if (remainingAmount <= 0) {
      expectedCompletionDate = current_date;
    } else {
      expectedCompletionDate = new Date("2099-12-31");
    }

    const progressPercentage = goal.targetAmount > 0 ? 
      Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;

    return {
      ...goal,
      monthsRemaining,
      periodsRemaining,
      monthlyNeeded,
      neededContribution,
      userContribution,
      monthlyUserContribution,
      isAchievable,
      expectedCompletionDate: expectedCompletionDate.toISOString().split("T")[0],
      progressPercentage,
      isOnTrack: isAchievable && monthsRemaining > 0 && remainingAmount > 0,
      isCompleted: remainingAmount <= 0,
    };
  });

  // Generate chart data for projections (monthly basis)
  const chartData: Array<{
    month: number;
    date: string;
    goals: Array<{ id: string; name: string; amount: number }>;
  }> = [];
  const today = new Date();

  for (let month = 0; month <= 24; month++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() + month);

    const goalsData = goalResults?.map((goal) => {
      let projectedAmount = goal.currentAmount;
      
      if (month > 0 && !goal.isCompleted) {
        // Calculate projected amount based on monthly contribution
        const monthlyContrib = goal.monthlyUserContribution;
        projectedAmount = Math.min(
          goal.targetAmount,
          goal.currentAmount + (monthlyContrib * month)
        );
      }
      
      return { 
        id: goal.id, 
        name: goal.name, 
        amount: Math.round(projectedAmount * 100) / 100 
      };
    }) || [];

    chartData.push({
      month,
      date: date.toISOString().split("T")[0],
      goals: goalsData,
    });
  }

  // Calculate totals
  const totalSaved = savingsGoals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0;
  const totalTarget = savingsGoals?.reduce((sum, goal) => sum + goal.targetAmount, 0) || 0;
  
  // Calculate total monthly needed across all goals
  const totalMonthlyNeeded = goalResults?.reduce((sum, goal) => {
    if (goal.isCompleted) return sum;
    return sum + normalizeMonthlySavings(goal.neededContribution, goal.contributionType);
  }, 0) || 0;

  return {
    goalResults,
    totalSaved,
    totalTarget,
    totalMonthlyNeeded,
    chartData,
  };
}