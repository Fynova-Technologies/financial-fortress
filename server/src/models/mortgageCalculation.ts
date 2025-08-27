
import { pgTable, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const mortgageCalculations = pgTable("mortgage_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  homePrice: integer("home_price").notNull(),
  downPaymentAmount: integer("down_payment_amount").notNull(),
  downPaymentPercent: integer("down_payment_percent").notNull(),
  loanTerm: integer("loan_term").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  propertyTax: integer("property_tax").notNull(),
  homeInsurance: integer("home_insurance").notNull(),
  pmi: integer("pmi").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertMortgageCalculationSchema = createInsertSchema(mortgageCalculations).pick({
  userId: true,
  homePrice: true,
  downPaymentAmount: true,
  downPaymentPercent: true,
  loanTerm: true,
  interestRate: true,
  propertyTax: true,
  homeInsurance: true,
  pmi: true,
  created_at: true,
});

export type MortgageCalculation = InferSelectModel<typeof mortgageCalculations>;
export type InsertMortgageCalculation = InferInsertModel<typeof mortgageCalculations>;
