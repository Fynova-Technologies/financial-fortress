
import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from './user.js'
import { InferSelectModel, InferInsertModel } from "drizzle-orm"


//budget table
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

export type Budget = InferSelectModel<typeof budgets>;
export type InsertBudget =InferInsertModel<typeof budgets>


//expenses categories table
export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  budget_id: integer("budget_id").references(() => budgets.id).notNull(),
  category_id: text("category_id").notNull(), // Frontend category ID
  name: text("name").notNull(),
  color: text("color").notNull(),
  amount: text("amount").notNull(), // Total amount for this category
  created_at: timestamp("created_at").defaultNow(),
});

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).pick({
  budget_id: true,
  category_id: true,
  name: true,
  color: true,
  amount: true,
});

export type ExpenseCategory = InferSelectModel<typeof expenseCategories>;
export type InsertExpenseCategory = InferInsertModel<typeof expenseCategories>;

// Expenses table
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  budget_id: integer("budget_id").references(() => budgets.id).notNull(),
  expense_id: text("expense_id").notNull(), // Frontend expense ID
  category_id: integer("category_id").references(() => expenseCategories.id).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  budget_id: true,
  expense_id: true,
  category_id: true,
  description: true,
  amount: true,
  date: true,
});

export type Expense = InferSelectModel<typeof expenses>;
export type InsertExpense = InferInsertModel<typeof expenses>;
