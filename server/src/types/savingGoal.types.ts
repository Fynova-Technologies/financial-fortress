import type { Request } from "express";

export interface SavingsGoalItem {
  name: string;
  target_amount: string;
  current_amount: string;
  target_date: string;
}
export interface SavingsGoalArrayRequestBody {
  savingsGoals: SavingsGoalItem[];
}
export interface SavingsGoalArrayRequest
  extends Request<{}, {}, SavingsGoalArrayRequestBody> {
  auth?: { sub: string; [key: string]: any; payload?: any; userId?: string };
}

export interface SavingsGoalDeleteRequest
  extends Request<{ id: string }, {}, {}> {
  auth?: { sub: string; [key: string]: any; payload?: any; userId?: string };
}