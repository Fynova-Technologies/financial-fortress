import type { Request } from "express";

export interface BudgetRequestBody {
  name: string;
  total_income: number;
  expenseCategories: {
    id: string;
    name: string;
    color: string;
    amount: string;
  }[];
  expenses: {
    id: string;
    description: string;
    category: string;
    date: string;
    amount: number;
  }[];
}

export interface BudgetRequest extends Request<{}, {}, BudgetRequestBody> {
  auth?: { sub: string; [key: string]: any };
}