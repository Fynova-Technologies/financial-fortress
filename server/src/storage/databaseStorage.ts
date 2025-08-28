// DatabaseStorage (drizzle-ORM)

import {
  users,
  budgets,
  expenses,
  expenseCategories,
  savingsGoals,
  mortgageCalculations,
  emiCalculations,
  retirementCalculation,
  salaryManagement,
  roiCalculations,
  type User,
  type InsertUser,
  type Budget,
  type InsertBudget,
  type Expense,
  type InsertExpense,
  type ExpenseCategory,
  type InsertExpenseCategory,
  type SavingsGoal,
  type InsertSavingsGoal,
  type InsertMortgageCalculation,
  type MortgageCalculation,
  type InsertEmiCalculation,
  type EmiCalculation,
  type InsertRetirementCalculation,
  type RetirementCalculation,
  type InsertSalaryManagement,
  type SalaryManagement,
  type InsertRoiCalculation,
  type RoiCalculation,
} from "../models/index.js";

import { db } from "../utils/db.js";
import { eq } from "drizzle-orm";
import type { IStorage, CreateBudgetRequest, CompleteBudget } from "./types.js";

/**
 * DatabaseStorage - implementation backed by Drizzle / your DB
 */
export class DatabaseStorage implements IStorage {
  // ------ user ------
  async getUser(id: number): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.username, username));
    return rows[0];
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.auth0_id, auth0Id));
    return rows[0];
  }

  async getUserbyEmail(email: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.email, email));
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    if (!result || result.length === 0) throw new Error("Failed to create user");
    return result[0];
  }

  // ------ budget ------
  async createBudget(budget: InsertBudget): Promise<Budget> {
    const result = await db.insert(budgets).values(budget).returning();
    if (!result || result.length === 0) throw new Error("Failed to create budget");
    return result[0];
  }

  async getBudgetsByUserId(userId: number): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.user_id, userId));
  }

  async getBudget(id: number): Promise<Budget | undefined> {
    const rows = await db.select().from(budgets).where(eq(budgets.id, id));
    return rows[0];
  }

  async getCompleteBudget(id: number): Promise<CompleteBudget | undefined> {
    const budget = await this.getBudget(id);
    if (!budget) return undefined;

    const [categories, expenseList] = await Promise.all([
      this.getExpenseCategoriesByBudgetId(id),
      this.getExpensesByBudgetId(id),
    ]);

    return { ...budget, expense_categories: categories, expenses: expenseList };
  }

  /**
   * createCompleteBudget - creates budget + categories + expenses in a single transaction
   */
  async createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget> {
    return await db.transaction(async (tx) => {
      // 1) insert budget
      const [createdBudget] = await tx.insert(budgets).values({
        user_id: budgetData.user_id,
        name: budgetData.name,
        total_income: budgetData.total_income,
      }).returning();

      if (!createdBudget) {
        throw new Error("Failed to create budget");
      }

      let createdCategories: ExpenseCategory[] = [];
      let createdExpenses: Expense[] = [];

      // 2) categories
      if (budgetData.expense_categories && budgetData.expense_categories.length > 0) {
        const inserts = budgetData.expense_categories.map((c) => ({
          budget_id: createdBudget.id,
          category_id: c.id,
          name: c.name,
          color: c.color,
          amount: c.amount,
        }));

        createdCategories = await tx.insert(expenseCategories).values(inserts).returning();
      }

      // 3) expenses
      if (budgetData.expenses && budgetData.expenses.length > 0) {
        // map frontend category id -> DB category.id
        const categoryMap = new Map<string, number>(
          createdCategories.map((c) => [c.category_id, c.id])
        );

        const expenseInserts = budgetData.expenses.map((e) => {
          const categoryDbId = categoryMap.get(e.category);
          if (!categoryDbId) {
            // Abort transaction with clear error
            throw new Error(`Category not found for expense "${e.description}" (frontend category id: ${e.category})`);
          }
          return {
            budget_id: createdBudget.id,
            expense_id: e.id,
            category_id: categoryDbId,
            description: e.description,
            amount: e.amount.toString(),
            date: new Date(e.date),
          };
        });

        createdExpenses = await tx.insert(expenses).values(expenseInserts).returning();
      }

      return {
        ...createdBudget,
        expense_categories: createdCategories,
        expenses: createdExpenses,
      };
    });
  }

  // ------ expenses & categories ------
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const rows = await db.insert(expenses).values(expense).returning();
    return rows[0];
  }

  async getExpensesByBudgetId(budgetId: number): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.budget_id, budgetId));
  }

  async createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory> {
    const rows = await db.insert(expenseCategories).values(category).returning();
    return rows[0];
  }

  async getExpenseCategoriesByBudgetId(budgetId: number): Promise<ExpenseCategory[]> {
    return await db.select().from(expenseCategories).where(eq(expenseCategories.budget_id, budgetId));
  }

  // ------ savings goals ------
  async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const rows = await db.insert(savingsGoals).values(goal).returning();
    return rows[0];
  }

  async getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]> {
    return await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
  }

  async deleteSavingsGoal(id: number): Promise<boolean> {
    const deleted = await db.delete(savingsGoals).where(eq(savingsGoals.id, id)).returning();
    return deleted.length > 0;
  }

  // ------ mortgage, emi, retirement, salary, roi ------
  async createMortgageCalculation(data: InsertMortgageCalculation): Promise<MortgageCalculation> {
    const [row] = await db.insert(mortgageCalculations).values(data).returning();
    return row;
  }

  async getMortgageCalculationsByUserId(userId: number): Promise<MortgageCalculation[]> {
    return await db.select().from(mortgageCalculations).where(eq(mortgageCalculations.userId, userId));
  }

  async createEmiCalculation(data: InsertEmiCalculation): Promise<EmiCalculation> {
    const [row] = await db.insert(emiCalculations).values(data).returning();
    return row;
  }

  async getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]> {
    return await db.select().from(emiCalculations).where(eq(emiCalculations.userId, userId));
  }

  async createRetirementCalculation(data: InsertRetirementCalculation): Promise<RetirementCalculation> {
    const [row] = await db.insert(retirementCalculation).values(data).returning();
    return row;
  }

  async getRetirementCalculationsByUserId(userId: number): Promise<RetirementCalculation[]> {
    return await db.select().from(retirementCalculation).where(eq(retirementCalculation.userId, userId));
  }

  async createSalaryManagement(data: InsertSalaryManagement): Promise<SalaryManagement> {
    const [row] = await db.insert(salaryManagement).values(data).returning();
    return row;
  }

  async getSalaryManagementByUserId(userId: number): Promise<SalaryManagement[]> {
    return await db.select().from(salaryManagement).where(eq(salaryManagement.userId, userId));
  }

  async createRoiCalculation(data: InsertRoiCalculation): Promise<RoiCalculation> {
    const [row] = await db.insert(roiCalculations).values(data).returning();
    return row;
  }

  async getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]> {
    return await db.select().from(roiCalculations).where(eq(roiCalculations.userId, userId));
  }
}
