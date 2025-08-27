
import { pgTable, serial, integer, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const roiCalculations = pgTable("roi_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  initialInvestment: integer("investment_amount").notNull(),
  additionalContribution: integer("addition_contributions").notNull(),
  contributionFrequency: text("contribution_frequency").notNull(),
  annualRate: decimal("annual_rate", { precision: 5, scale: 2 }).notNull(),
  compoundingFrequency: text("compounding_frequency").notNull(),
  investmentTerm: integer("investment_term").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertRoiCalculationSchema = createInsertSchema(roiCalculations).pick({
  userId: true,
  initialInvestment: true,
  additionalContribution: true,
  contributionFrequency: true,
  annualRate: true,
  compoundingFrequency: true,
  investmentTerm: true,
  created_at: true,
  updated_at: true,
});

export type RoiCalculation = InferSelectModel<typeof roiCalculations>;
export type InsertRoiCalculation = InferInsertModel<typeof roiCalculations>;
