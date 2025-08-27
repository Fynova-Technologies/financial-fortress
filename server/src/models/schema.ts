// import exp from "constants";
// import { int } from "drizzle-orm/mysql-core";
// import { pgTable, text, serial, integer, timestamp, decimal} from "drizzle-orm/pg-core";
// import { numeric } from "drizzle-orm/sqlite-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// // User table
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull().unique(),
//   // password: text("password").notNull(),
//   auth0_id: text("auth0_id").notNull().unique(),
//   email: text("email").notNull().unique(),
//   created_at: timestamp("created_at").defaultNow(),
// });

// export const insertUserSchema = createInsertSchema(users).pick({
//   username: true,
//   // password: true,
//   email: true,
//   auth0_id: true,
// });

// // Budget table
// export const budgets = pgTable("budgets", {
//   id: serial("id").primaryKey(),
//   user_id: integer("user_id").references(() => users.id).notNull(),
//   name: text("name").notNull(),
//   total_income: decimal("total_income", { precision: 10, scale: 2 }).notNull(),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow(),
// });

// export const insertBudgetSchema = createInsertSchema(budgets).pick({
//   user_id: true,
//   name: true,
//   total_income: true,
// });

// // Expense Categories table
// export const expenseCategories = pgTable("expense_categories", {
//   id: serial("id").primaryKey(),
//   budget_id: integer("budget_id").references(() => budgets.id).notNull(),
//   category_id: text("category_id").notNull(), // Frontend category ID
//   name: text("name").notNull(),
//   color: text("color").notNull(),
//   amount: text("amount").notNull(), // Total amount for this category
//   created_at: timestamp("created_at").defaultNow(),
// });

// export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).pick({
//   budget_id: true,
//   category_id: true,
//   name: true,
//   color: true,
//   amount: true,
// });

// // Expenses table
// export const expenses = pgTable("expenses", {
//   id: serial("id").primaryKey(),
//   budget_id: integer("budget_id").references(() => budgets.id).notNull(),
//   expense_id: text("expense_id").notNull(), // Frontend expense ID
//   category_id: integer("category_id").references(() => expenseCategories.id).notNull(),
//   description: text("description").notNull(),
//   amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
//   date: timestamp("date").notNull(),
//   created_at: timestamp("created_at").defaultNow(),
// });

// export const insertExpenseSchema = createInsertSchema(expenses).pick({
//   budget_id: true,
//   expense_id: true,
//   category_id: true,
//   description: true,
//   amount: true,
//   date: true,
// });

// // Savings Goals table
// export const savingsGoals = pgTable("savings_goals", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id").references(() => users.id).notNull(),
//   name: text("name").notNull(),
//   target_amount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
//   current_amount: decimal("current_amount", { precision: 10, scale: 2 }).notNull(),
//   target_date: timestamp("target_date").notNull(),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow(),
// });

// export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).pick({
//   userId: true,
//   name: true,
//   target_amount: true,
//   current_amount: true,
//   target_date: true,
// });

// // Mortgage Calculations table
// export const mortgageCalculations = pgTable('mortgage_calculations', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id').notNull(),
//   homePrice: integer('home_price').notNull(),
//   downPaymentAmount: integer('down_payment_amount').notNull(),
//   downPaymentPercent: integer('down_payment_percent').notNull(),
//   loanTerm: integer('loan_term').notNull(), // in years
//   // interestRate: integer('interest_rate').notNull(), // in basis points (e.g., 300 for 3.00%)
//   interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(), // e.g., 8.50%
//   propertyTax: integer('property_tax').notNull(), // Annual property tax in dollars
//   homeInsurance: integer('home_insurance').notNull(), // Annual home insurance in dollars
//   pmi: integer('pmi').notNull(), // Private Mortgage Insurance in basis points (e.g., 50 for 0.50%)
//   created_at: timestamp('created_at').defaultNow(),
// });

// export const insertMortgageCalculationSchema = createInsertSchema(mortgageCalculations).pick({
//   userId: true, // Assuming userId is a string    
//   homePrice: true,
//   downPaymentAmount: true,  
//   downPaymentPercent: true,
//   loanTerm: true,
//   interestRate: true,
//   propertyTax: true,  
//   homeInsurance: true,
//   pmi: true,
//   created_at: true,  
// });  

// // EMI Calculations table
// export const emiCalculations = pgTable('emi_calculations', {
//   id: serial('id').primaryKey(),  
//   userId: integer('user_id').notNull(),
//   loanAmount: integer('loan_amount').notNull(),
//   interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(), // e.g., 8.50%
//   // interestRate: integer('interest_rate').notNull(), // in basis points (e.g., 300 for 3.00%)
//   loanTerm: integer('loan_term').notNull(), // in months
//   termType: text('term_type').notNull(), // 'years' or 'months'
//   startDate: timestamp('start_date').notNull(), 
//   created_at: timestamp('created_at').defaultNow(),
// });

// export const insertEmiCalculationSchema = createInsertSchema(emiCalculations).pick({
//   userId: true, // Assuming userId is a string  
//   loanAmount: true,
//   interestRate: true,
//   loanTerm: true,
//   termType: true, // 'years' or 'months'
//   startDate: true,
//   created_at: true,
// });

// // Retirement Calculations table
// export const retirementCalculations = pgTable('retirement_calculations', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id').notNull(),
//   currentAge: integer('current_age').notNull(),
//   retirementAge: integer('retirement_age').notNull(),
//   lifeExpectancy: integer('life_expectancy').notNull(),
//   currentSavings: integer('current_savings').notNull(),
//   monthlyContribution: integer('monthly_contribution').notNull(),
//   expectedReturn: decimal('expected_return', { precision: 5, scale: 2 }).notNull(), // e.g., 5.00%
//   // expectedReturn: integer('expected_return').notNull(), // in basis points (e.g., 500 for 5.00%)
//   // inflationRate: integer('inflation_rate').notNull(), // in basis points (e.g., 200 for 2.00%)
//   inflationRate: decimal('inflation_rate', { precision: 5, scale: 2 }).notNull(), // e.g., 2.50%
//   desiredMonthlyIncome: integer('desired_monthly_income').notNull(),
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at').defaultNow(),
// });

// export const insertRetirementCalculationSchema = createInsertSchema(retirementCalculations).pick({
//   userId: true, // Assuming userId is a string  
//   currentAge: true,
//   retirementAge: true,
//   lifeExpectancy: true,
//   currentSavings: true,
//   monthlyContribution: true,
//   expectedReturn: true,
//   inflationRate: true,
//   desiredMonthlyIncome: true,
//   created_at: true,
//   updated_at: true,
// });

// // Salary Management table
// export const salaryManagement = pgTable('salary_management', {
//   id: serial('id').primaryKey(),  
//   userId: integer('user_id').notNull(),
//   grossSalary: integer('gross_salary').notNull(),
//   taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(), // e.g., 3.00%
//   deductions: integer('deductions').notNull(), // Total deductions in dollars
//   bonuses: integer('bonuses').notNull(), // Total bonuses in dollars
//   period: text('period').notNull(), // 'monthly' or 'annual'
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at').defaultNow(),
// });

// export const insertSalaryManagementSchema = createInsertSchema(salaryManagement).pick({
//   userId: true, // Assuming userId is a string  
//   grossSalary: true,
//   taxRate: true,
//   deductions: true,
//   bonuses: true,
//   period: true, // 'monthly' or 'annual'
//   created_at: true,
//   updated_at: true,
// });

// // ROI Calculations table
// export const roiCalculations = pgTable('roi_calculations', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id').notNull(),
//   initialInvestment: integer('investment_amount').notNull(),
//   additionalContribution: integer('addition_contributions').notNull(), // Total additional contributions in dollars
//   contributionFrequency: text('contribution_frequency').notNull(), // 'monthly', 'quarterly', 'annually'
//   annualRate: decimal('annual_rate', { precision: 5, scale: 2 }).notNull(), // Annual rate of return in percentage (e.g., 5.00%)
//   compoundingFrequency: text('compounding_frequency').notNull(), // 'daily', 'monthly', 'quarterly', 'annually'
//   investmentTerm: integer('investment_term').notNull(), // Investment term in years
//   // returnAmount: integer('return_amount').notNull(),
//   // investmentDate: timestamp('investment_date').notNull(),
//   // returnDate: timestamp('return_date').notNull(),
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at').defaultNow(),
// });

// export const insertRoiCalculationSchema = createInsertSchema(roiCalculations).pick({
//   userId: true, // Assuming userId is a string  
//   initialInvestment: true,
//   additionalContribution: true,
//   contributionFrequency: true, // 'monthly', 'quarterly', 'annually'  
//   annualRate: true, // Annual rate of return in basis points (e.g., 500 for 5.00%)
//   compoundingFrequency: true, // 'daily', 'monthly', 'quarterly', 'annually'
//   investmentTerm: true, // Investment term in years
//   // returnAmount: true,
//   // investmentDate: true,
//   // returnDate: true,
//   created_at: true,
//   updated_at: true,
// });

// // // Currencies table
// // export const currencies = pgTable('currencies', {
// //   id: serial('id').primaryKey(), 
// //   userId: integer('user_id').references(() => users.id).notNull(), // Assuming each currency is associated with a user   
// //   code: text('code').notNull().unique(), // Currency code (e.g., USD, EUR)
// //   name: text('name').notNull(), // Full name of the currency (e.g., US Dollar, Euro)
// //   symbol: text('symbol').notNull(), // Symbol of the currency (e.g., $, €, £)
// //   exchangeRate: decimal('exchange_rate', { precision: 10, scale: 6 }).notNull(), // Exchange rate against a base currency (e.g., USD) 
// //   createdAt: timestamp('created_at').defaultNow(), // Timestamp when the currency was added
// //   updatedAt: timestamp('updated_at').defaultNow(), // Timestamp when the currency was last updated
// // });

// // export const insertCurrencySchema = createInsertSchema(currencies).pick({
// //   userId: true, // Assuming userId is a string
// //   code: true,
// //   name: true,
// //   symbol: true,
// //   exchangeRate: true,
// //   createdAt: true,
// //   updatedAt: true,
// // });

// // Savings Tracker table
// // export const savingsGoal = pgTable('savings_tracker', {
// //   id: serial('id').primaryKey(),  
// //   userId: integer('user_id').references(() => users.id).notNull(),
// //   name: text('goal_name').notNull(), // Name of the savings goal
// //   targetAmount: decimal('target_amount', { precision: 10, scale: 2 }).notNull(), // Target amount to save
// //   currentAmount: decimal('current_amount', { precision: 10, scale: 2 }).notNull(), // Current amount saved
// //   targetDate: timestamp('target_date').notNull(), // Date by which the goal should be achieved  
// //   created_at: timestamp('created_at').defaultNow(), // Timestamp when the goal was created
// //   updated_at: timestamp('updated_at').defaultNow(), // Timestamp when the goal was last updated
// // });

// // export const insertSavingsGoalSchema = createInsertSchema(savingsGoal).pick({
// //   userId: true, // Assuming userId is a string  
// //   name: true,
// //   targetAmount: true,
// //   currentAmount: true,
// //   targetDate: true,
// //   created_at: true,
// //   updated_at: true,
// // });

// // Types
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;

// export type InsertBudget = z.infer<typeof insertBudgetSchema>;
// export type Budget = typeof budgets.$inferSelect;

// export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
// export type ExpenseCategory = typeof expenseCategories.$inferSelect;

// export type InsertExpense = z.infer<typeof insertExpenseSchema>;
// export type Expense = typeof expenses.$inferSelect;

// export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
// export type SavingsGoal = typeof savingsGoals.$inferSelect;

// export type InsertMortgageCalculation = z.infer<typeof insertMortgageCalculationSchema>;
// export type MortgageCalculation = typeof mortgageCalculations.$inferSelect;

// export type InsertEmiCalculation = z.infer<typeof insertEmiCalculationSchema>;
// export type EmiCalculation = typeof emiCalculations.$inferSelect;

// export type InsertRetirementCalculation = z.infer<typeof insertRetirementCalculationSchema>;
// export type RetirementCalculation = typeof retirementCalculations.$inferSelect;

// export type InsertSalaryManagement = z.infer<typeof insertSalaryManagementSchema>;
// export type SalaryManagement = typeof salaryManagement.$inferSelect;

// export type InsertRoiCalculation = z.infer<typeof insertRoiCalculationSchema>;
// export type RoiCalculation = typeof roiCalculations.$inferSelect;

// // export type InsertCurrency = z.infer<typeof insertCurrencySchema>;
// // export type Currency = typeof currencies.$inferSelect;

// // export type InsertSavingsTracker = z.infer<typeof insertSavingsGoalSchema>;
// // export type SavingsTracker = typeof savingsGoal.$inferSelect;