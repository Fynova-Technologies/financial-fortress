import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Budget table
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  total_income: decimal("total_income", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertBudgetSchema = createInsertSchema(budgets).pick({
  user_id: true,
  name: true,
  total_income: true,
});

// Expense Categories table
export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  budget_id: integer("budget_id").references(() => budgets.id).notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).pick({
  budget_id: true,
  name: true,
  color: true,
});

// Expenses table
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  budget_id: integer("budget_id").references(() => budgets.id).notNull(),
  category_id: integer("category_id").references(() => expenseCategories.id).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  budget_id: true,
  category_id: true,
  description: true,
  amount: true,
  date: true,
});

// Savings Goals table
export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  target_amount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  current_amount: decimal("current_amount", { precision: 10, scale: 2 }).notNull(),
  target_date: timestamp("target_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).pick({
  user_id: true,
  name: true,
  target_amount: true,
  current_amount: true,
  target_date: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
