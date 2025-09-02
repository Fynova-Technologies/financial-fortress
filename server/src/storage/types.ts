//shared interfaces & types (IStorage, CreateBudgetRequest, CompleteBudget)

import type {
  User,
  InsertUser,
  Budget,
  InsertBudget,
  Expense,
  InsertExpense,
  ExpenseCategory,
  InsertExpenseCategory,
  SavingsGoal,
  InsertSavingsGoal,
  InsertMortgageCalculation,
  MortgageCalculation,
  InsertEmiCalculation,
  EmiCalculation,
  InsertRetirementCalculation,
  RetirementCalculation,
  InsertSalaryManagement,
  SalaryManagement,
  InsertRoiCalculation,
  RoiCalculation,
} from "../models/index";

/**
 * CreateBudgetRequest - the payload for creating a budget with categories & expenses
 */
export interface CreateBudgetRequest {
  user_id: number;
  name: string;
  total_income: number;
  expense_categories?: Array<{
    id: string; // frontend category id
    name: string;
    color: string;
    amount: number;
  }>;
  expenses?: Array<{
    id: string; // frontend expense id
    description: string;
    category: string; // frontend category id (maps to category.category_id)
    date: string;
    amount: number;
  }>;
}

/**
 * CompleteBudget - Budget + relations
 */
export interface CompleteBudget extends Budget {
  expense_categories?: ExpenseCategory[];
  expenses?: Expense[];
}

/**
 * IStorage - storage abstraction used by the server
 */
export interface IStorage {
  // user
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAuth0Id(id: string): Promise<User | undefined>;
  getUserbyEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // budget
  createBudget(budget: InsertBudget): Promise<Budget>;
  createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget>;
  getBudgetsByUserId(userId: number): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  getCompleteBudget(id: number): Promise<CompleteBudget | undefined>;

  // expenses
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpensesByBudgetId(budgetId: number): Promise<Expense[]>;

  // categories
  createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory>;
  getExpenseCategoriesByBudgetId(budgetId: number): Promise<ExpenseCategory[]>;

  // savings goals
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]>;
  deleteSavingsGoal?(id: number): Promise<boolean>;

  // mortgage
  createMortgageCalculation(data: InsertMortgageCalculation): Promise<MortgageCalculation>;
  getMortgageCalculationsByUserId(userId: number): Promise<MortgageCalculation[]>;

  // emi
  createEmiCalculation(data: InsertEmiCalculation): Promise<EmiCalculation>;
  getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]>;

  // retirement
  createRetirementCalculation(data: InsertRetirementCalculation): Promise<RetirementCalculation>;
  getRetirementCalculationsByUserId(userId: number): Promise<RetirementCalculation[]>;

  // salary
  createSalaryManagement(data: InsertSalaryManagement): Promise<SalaryManagement>;
  getSalaryManagementByUserId(userId: number): Promise<SalaryManagement[]>;

  // roi
  createRoiCalculation(data: InsertRoiCalculation): Promise<RoiCalculation>;
  getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]>;
}
