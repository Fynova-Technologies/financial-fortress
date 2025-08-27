
import { pgTable, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const retirementCalculation = pgTable("retirement_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  currentAge: integer("current_age").notNull(),
  retirementAge: integer("retirement_age").notNull(),
  lifeExpectancy: integer("life_expectancy").notNull(),
  currentSavings: integer("current_savings").notNull(),
  monthlyContribution: integer("monthly_contribution").notNull(),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  inflationRate: decimal("inflation_rate", { precision: 5, scale: 2 }).notNull(),
  desiredMonthlyIncome: integer("desired_monthly_income").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertRetirementCalculationSchema = createInsertSchema(retirementCalculation).pick({
  userId: true,
  currentAge: true,
  retirementAge: true,
  lifeExpectancy: true,
  currentSavings: true,
  monthlyContribution: true,
  expectedReturn: true,
  inflationRate: true,
  desiredMonthlyIncome: true,
});


export type RetirementCalculation = InferSelectModel<typeof retirementCalculation>;
export type InsertRetirementCalculation = InferInsertModel<typeof retirementCalculation>;