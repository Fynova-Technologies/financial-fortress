import type { Request } from "express";

export interface BudgetRequestBody {
  name: string;
  total_income: number;
  expenseCategories: {
    id: string;
    category_id?: string;
    name: string;
    color: string;
    amount: string;
  }[];
  expenses: {
    id: string;
    expense_id?: string;
    description: string;
    category: string;
    date: string;
    amount: number;
  }[];
}

// Define the route parameters interface - make id optional for routes that don't need it
export interface BudgetParams {
  id?: string;
}

// Update BudgetRequest to include route parameters
export interface BudgetRequest extends Request<BudgetParams, {}, BudgetRequestBody> {
  auth?: { sub: string; [key: string]: any };
}

// For GET requests that don't have a body
export interface BudgetGetRequest extends Request {
  auth?: { sub: string; [key: string]: any };
}

// For requests that don't need params (like POST to create new budget)
export interface BudgetCreateRequest extends Request<{}, {}, BudgetRequestBody> {
  auth?: { sub: string; [key: string]: any };
}