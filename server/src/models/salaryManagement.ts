
import { pgTable, serial, integer, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm"

export const salaryManagement = pgTable("salary_management", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  grossSalary: integer("gross_salary").notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
  deductions: integer("deductions").notNull(),
  bonuses: integer("bonuses").notNull(),
  period: text("period").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertSalaryManagementSchema = createInsertSchema(salaryManagement).pick({
  userId: true,
  grossSalary: true,
  taxRate: true,
  deductions: true,
  bonuses: true,
  period: true,
  created_at: true,
  updated_at: true,
});

export type SalaryManagement = InferSelectModel<typeof salaryManagement>;
export type InsertSalaryManagement = InferInsertModel<typeof salaryManagement>;