
import { pgTable, serial, integer, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const emiCalculations = pgTable("emi_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  loanTerm: integer("loan_term").notNull(),
  termType: text("term_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertEmiCalculationSchema = createInsertSchema(emiCalculations).pick({
  userId: true,
  loanAmount: true,
  interestRate: true,
  loanTerm: true,
  termType: true,
  startDate: true,
  created_at: true,
});

export type EmiCalculation = InferSelectModel<typeof emiCalculations>;
export type InsertEmiCalculation = InferInsertModel<typeof emiCalculations>;