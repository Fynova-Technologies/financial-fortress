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
import { v4 as uuidv4 } from "uuid";

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
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return rows[0];
  }

  async getUserByAuth0Id(auth0_id: string): Promise<User | undefined> {
    console.log("Looking for user in DB:", auth0_id);
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.auth0_id, auth0_id));
    return rows[0];
  }

  async getUserbyEmail(email: string): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.email, email));
      console.log("Checking user by email:", email, rows);
    return rows[0];
  }


  async createUser(insertUser: InsertUser): Promise<User> {
    console.log("Inserting user:", insertUser);
    try {
      const result = await db.insert(users).values(insertUser).returning();
      console.log("Insert result:", result);
      if (!result || result.length === 0)
        throw new Error("Failed to create user");
      return result[0];
    } catch (err) {
      console.error("DB insertion error:", err);
      throw err;
    }
  }

  // ------ budget ------
  async createBudget(budget: InsertBudget): Promise<Budget> {
    const result = await db.insert(budgets).values(budget).returning();
    if (!result || result.length === 0)
      throw new Error("Failed to create budget");
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
async createCompleteBudget(
  budgetData: CreateBudgetRequest
): Promise<CompleteBudget> {
  // Basic validation / logging so we can see what's coming from the frontend
  console.log("createCompleteBudget - incoming budgetData:", JSON.stringify(budgetData, null, 2));
  if (!budgetData || typeof budgetData.user_id !== "number") {
    throw new Error("Invalid budgetData: missing user_id");
  }

  return await db.transaction(async (tx) => {
    // 1) insert budget (total_income as string if DB expects numeric/text)
    const [createdBudget] = await tx
      .insert(budgets)
      .values({
        user_id: budgetData.user_id,
        name: budgetData.name ?? "Untitled",
        total_income: (budgetData.total_income ?? 0).toString(),
      })
      .returning();

    console.log("Created budget:", createdBudget);
    if (!createdBudget) throw new Error("Failed to create budget");

    let createdCategories: ExpenseCategory[] = [];
    let createdExpenses: Expense[] = [];

    // 2) categories
    if (Array.isArray(budgetData.expense_categories) && budgetData.expense_categories.length > 0) {
      // Build inserts. Ensure category_id exists (generate if frontend didn't send one).
      const categoryInserts = budgetData.expense_categories.map((c) => {
        // Basic payload validation
        if (!c.name) throw new Error("Expense category missing name");
        return {
          budget_id: createdBudget.id,
          // category_id is a domain-level string id (generate if absent)
          category_id: typeof c.id === "string" && c.id.length > 0 ? c.id : uuidv4(),
          name: c.name,
          color: c.color ?? "#cccccc",
          amount: (c.amount ?? 0).toString(),
        };
      });

      console.log("Category inserts:", categoryInserts);
      createdCategories = await tx
        .insert(expenseCategories)
        .values(categoryInserts)
        .returning();

      console.log("Inserted categories (from DB):", createdCategories);
    }

    // 3) expenses
    if (Array.isArray(budgetData.expenses) && budgetData.expenses.length > 0) {
      // Build map from frontend category_id -> DB auto PK id
      // NOTE: createdCategories should contain column 'category_id' (string) and 'id' (number)
      const categoryMap = new Map<string, number>(
        createdCategories.map((c) => [c.category_id, c.id])
      );
      console.log("categoryMap:", Array.from(categoryMap.entries()));

      const expenseInserts = budgetData.expenses.map((e) => {
        // e.category is expected to be frontend category_id (string)
        const frontendCategoryId = e.category;
        const categoryDbId = categoryMap.get(frontendCategoryId);

        if (!categoryDbId) {
          // If no mapping found, fail early with detailed message
          throw new Error(
            `Category mapping missing for expense "${e.description}" — frontend category id: ${frontendCategoryId}`
          );
        }

        if (!e.description) throw new Error("Expense missing description");

        return {
          budget_id: createdBudget.id,
          // expense table expects category_id (numeric FK to expense_categories.id)
          category_id: categoryDbId,
          expense_id: typeof e.id === "string" && e.id.length > 0 ? e.id : uuidv4(),
          description: e.description,
          amount: (e.amount ?? 0).toString(),
          date: e.date ? new Date(e.date) : new Date(),
        };
      });

      console.log("Expense inserts:", expenseInserts);
      createdExpenses = await tx.insert(expenses).values(expenseInserts).returning();
      console.log("Inserted expenses (from DB):", createdExpenses);
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
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.budget_id, budgetId));
  }

  async createExpenseCategory(
    category: InsertExpenseCategory
  ): Promise<ExpenseCategory> {
    const rows = await db
      .insert(expenseCategories)
      .values(category)
      .returning();
    return rows[0];
  }

  async getExpenseCategoriesByBudgetId(
    budgetId: number
  ): Promise<ExpenseCategory[]> {
    return await db
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.budget_id, budgetId));
  }

  // ------ savings goals ------
  async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const rows = await db.insert(savingsGoals).values(goal).returning();
    return rows[0];
  }

  async getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]> {
    return await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId));
  }

  async deleteSavingsGoal(id: number): Promise<boolean> {
    const deleted = await db
      .delete(savingsGoals)
      .where(eq(savingsGoals.id, id))
      .returning();
    return deleted.length > 0;
  }

  // ------ mortgage, emi, retirement, salary, roi ------
  async createMortgageCalculation(
    data: InsertMortgageCalculation
  ): Promise<MortgageCalculation> {
    const [row] = await db
      .insert(mortgageCalculations)
      .values(data)
      .returning();
    return row;
  }

  async getMortgageCalculationsByUserId(
    userId: number
  ): Promise<MortgageCalculation[]> {
    return await db
      .select()
      .from(mortgageCalculations)
      .where(eq(mortgageCalculations.userId, userId));
  }

  async createEmiCalculation(
    data: InsertEmiCalculation
  ): Promise<EmiCalculation> {
    const [row] = await db.insert(emiCalculations).values(data).returning();
    return row;
  }

  async getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]> {
    return await db
      .select()
      .from(emiCalculations)
      .where(eq(emiCalculations.userId, userId));
  }

  async createRetirementCalculation(
    data: InsertRetirementCalculation
  ): Promise<RetirementCalculation> {
    const [row] = await db
      .insert(retirementCalculation)
      .values(data)
      .returning();
    return row;
  }

  async getRetirementCalculationsByUserId(
    userId: number
  ): Promise<RetirementCalculation[]> {
    return await db
      .select()
      .from(retirementCalculation)
      .where(eq(retirementCalculation.userId, userId));
  }

  async createSalaryManagement(
    data: InsertSalaryManagement
  ): Promise<SalaryManagement> {
    const [row] = await db.insert(salaryManagement).values(data).returning();
    return row;
  }

  async getSalaryManagementByUserId(
    userId: number
  ): Promise<SalaryManagement[]> {
    return await db
      .select()
      .from(salaryManagement)
      .where(eq(salaryManagement.userId, userId));
  }

  async createRoiCalculation(
    data: InsertRoiCalculation
  ): Promise<RoiCalculation> {
    const [row] = await db.insert(roiCalculations).values(data).returning();
    return row;
  }

  async getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]> {
    return await db
      .select()
      .from(roiCalculations)
      .where(eq(roiCalculations.userId, userId));
  }
}
