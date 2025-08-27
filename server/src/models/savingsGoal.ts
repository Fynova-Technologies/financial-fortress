
import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from './user.js'
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  target_amount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  current_amount: decimal("current_amount", { precision: 10, scale: 2 }).notNull(),
  target_date: timestamp("target_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).pick({
  userId: true,
  name: true,
  target_amount: true,
  current_amount: true,
  target_date: true,
});

export type SavingsGoal = InferSelectModel<typeof savingsGoals>;
export type InsertSavingsGoal = InferInsertModel<typeof savingsGoals>;
