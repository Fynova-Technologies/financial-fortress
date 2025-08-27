// import { users, budgets, expenses, expenseCategories, savingsGoals, mortgageCalculations, emiCalculations, retirementCalculations, salaryManagement, roiCalculations, type User, type InsertUser, type Budget, type InsertBudget, type Expense, type InsertExpense, type ExpenseCategory, type InsertExpenseCategory, type SavingsGoal, type InsertSavingsGoal, type InsertMortgageCalculation, type MortgageCalculation, type EmiCalculation, type InsertEmiCalculation, type RetirementCalculation, type InsertRetirementCalculation, type SalaryManagement, type InsertSalaryManagement, type RoiCalculation, type InsertRoiCalculation } from "../models/schema.js";
// import passport from "passport";
// import { db } from "../utils/db.js";
// import { eq } from "drizzle-orm";

// // Add interface for complete budget creation
// export interface CreateBudgetRequest {
//   user_id: number;
//   name: string;
//   total_income: string;
//   expense_categories?: Array<{
//     id: string;
//     name: string;
//     color: string;
//     amount: string;
//   }>;
//   expenses?: Array<{
//     id: string;
//     description: string;
//     category: string; // This will be the frontend category ID
//     date: string;
//     amount: number;
//   }>;
// }

// // Add interface for complete budget response
// export interface CompleteBudget extends Budget {
//   expense_categories?: ExpenseCategory[];
//   expenses?: Expense[];
// }

// // modify the interface with any CRUD methods
// // you might need
// export interface IStorage {
//   // user operation
//   getUser(id: number): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   getUserByAuth0Id(id: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;

//   // Budget operation
//   createBudget(budget: InsertBudget): Promise<Budget>;
//   createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget>;
//   getBudgetsByUserId(userId: number): Promise<Budget[]>;
//   getBudget(id: number): Promise<Budget | undefined>;
//   getCompleteBudget(id: number): Promise<CompleteBudget | undefined>;
  
//   // Expense operations
//   createExpense(expense: InsertExpense): Promise<Expense>; 
//   getExpensesByBudgetId(budgetId: number): Promise<Expense[]>;
  
//   // Expense Category operations
//   createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory>;
//   getExpenseCategoriesByBudgetId(budgetId: number): Promise<ExpenseCategory[]>;
  
//   // Savings Goal operations
//   createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
//   getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]>;

//   // Mortgage calculation methods
//   createMortgageCalculation(data: InsertMortgageCalculation): Promise<MortgageCalculation>;
//   getMortgageCalculationsByUserId(userId: number): Promise<MortgageCalculation[]>;

//   // EMI calculation methods
//   createEmiCalculation(data: InsertEmiCalculation): Promise<EmiCalculation>;
//   getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]>;

//   // Retirement calculation methods
//   createRetirementCalculation(data: InsertRetirementCalculation): Promise<RetirementCalculation>;
//   getRetirementCalculationsByUserId(userId: number): Promise<RetirementCalculation[]>;

//   // Salary management methods
//   createSalaryManagement(data: InsertSalaryManagement): Promise<SalaryManagement>;
//   getSalaryManagementByUserId(userId: number): Promise<SalaryManagement[]>;

//   // ROI calculation methods
//   createRoiCalculation(data: InsertRoiCalculation): Promise<RoiCalculation>;
//   getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]>;

//   // Currency methods
//   // createCurrency(data: InsertCurrency): Promise<Currency>;
//   // getCurrencies(): Promise<Currency[]>;

//   // Savings tracker methods
//   // createSavingsTracker(data: InsertSavingsTracker): Promise<SavingsTracker>;
//   // getSavingsTrackersByUserId(userId: number): Promise<SavingsTracker[]>;
// }

// export class DatabaseStorage implements IStorage{

//   // user operation
//   async getUser(id: number): Promise<User | undefined>{
//     const result = await db.select().from(users).where(eq(users.id, id))
//     return result[0];
//   }

//     async getUserByUsername(username: string): Promise<User | undefined> {
//     const result = await db.select().from(users).where(eq(users.username, username));
//     return result[0];
//   }

//   async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
//     const result = await db.select().from(users).where(eq(users.auth0_id, auth0Id));
//     return result[0];
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     const result = await db.insert(users).values(insertUser).returning();
//     return result[0];
//   }

//   // Budget operations
//   async createBudget(budget: InsertBudget): Promise<Budget> {
//     const result = await db.insert(budgets).values(budget).returning();
//     return result[0];
//   }

//   // Create mortgage calculation
//   async createMortgageCalculation(data: InsertMortgageCalculation): Promise<MortgageCalculation> {
//     const [result] = await db.insert(mortgageCalculations).values(data).returning();
//     return result;
//   }

//   async getMortgageCalculationsByUserId(userId: number): Promise<MortgageCalculation[]> {
//     return await db.select().from(mortgageCalculations).where(eq(mortgageCalculations.userId, userId));
//   }

//   // Create EMI calculation
//   async createEmiCalculation(data: InsertEmiCalculation): Promise<EmiCalculation> {
//     const [result] = await db.insert(emiCalculations).values(data).returning();
//     return result;
//   }

//   async getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]> {
//     return await db.select().from(emiCalculations).where(eq(emiCalculations.userId, userId));
//   }

//   // Create retirement calculation
//   async createRetirementCalculation(data: InsertRetirementCalculation): Promise<RetirementCalculation> {
//     const [result] = await db.insert(retirementCalculations).values(data).returning();
//     return result;
//   }

//   async getRetirementCalculationsByUserId(userId: number): Promise<RetirementCalculation[]> {
//     return await db.select().from(retirementCalculations).where(eq(retirementCalculations.userId, userId));
//   }

//   // salary management methods
//   async createSalaryManagement(data: InsertSalaryManagement): Promise<SalaryManagement> {
//     const [result] = await db.insert(salaryManagement).values(data).returning();
//     return result;
//   }

//   async getSalaryManagementByUserId(userId: number): Promise<SalaryManagement[]> {
//     return await db.select().from(salaryManagement).where(eq(salaryManagement.userId, userId));
//   }

//   // ROI calculation methods
//   async createRoiCalculation(data: InsertRoiCalculation): Promise<RoiCalculation> {
//     const [result] = await db.insert(roiCalculations).values(data).returning();
//     return result;
//   }

//   async getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]> {
//     return await db.select().from(roiCalculations).where(eq(roiCalculations.userId, userId));
//   }

//   // Currency methods
//   // async createCurrency(data: InsertCurrency): Promise<Currency> {
//   //   const [result] = await db.insert(currencies).values(data).returning();
//   //   return result;
//   // }

//   // async getCurrencies(): Promise<Currency[]> {
//   //   return await db.select().from(currencies);
//   // }

//   // Savings tracker methods
//   // async createSavingsTracker(data: InsertSavingsTracker): Promise<SavingsTracker> {
//   //   const [result] = await db.insert(savingsTracker).values(data).returning();
//   //   return result;
//   // }

//   // async getSavingsTrackersByUserId(userId: number): Promise<SavingsTracker[]> {
//   //   return await db.select().from(savingsTracker).where(eq(savingsTracker.userId, userId));
//   // }

//   // New method to create complete budget with categories and expenses
//   async createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget> {
//     return await db.transaction(async (tx) => {
//       // 1. Create the budget first
//       const [budget] = await tx.insert(budgets).values({
//         user_id: budgetData.user_id,
//         name: budgetData.name,
//         total_income: budgetData.total_income,
//       }).returning();

//       let createdCategories: ExpenseCategory[] = [];
//       let createdExpenses: Expense[] = [];

//       // 2. Create expense categories if provided
//       if (budgetData.expense_categories && budgetData.expense_categories.length > 0) {
//         const categoryInserts = budgetData.expense_categories.map(cat => ({
//           budget_id: budget.id,
//           category_id: cat.id,
//           name: cat.name,
//           color: cat.color,
//           amount: cat.amount,
//         }));

//         createdCategories = await tx.insert(expenseCategories).values(categoryInserts).returning();
//       }

//       // 3. Create expenses if provided
//       if (budgetData.expenses && budgetData.expenses.length > 0) {
//         // Create a map from frontend category ID to database category ID
//         const categoryMap = new Map(
//           createdCategories.map(cat => [cat.category_id, cat.id])
//         );

//         const expenseInserts = budgetData.expenses.map(exp => {
//           const categoryDbId = categoryMap.get(exp.category);
//           if (!categoryDbId) {
//             throw new Error(`Category not found for expense: ${exp.description}`);
//           }

//           return {
//             budget_id: budget.id,
//             expense_id: exp.id,
//             category_id: categoryDbId,
//             description: exp.description,
//             amount: exp.amount.toString(),
//             date: new Date(exp.date),
//           };
//         });

//         createdExpenses = await tx.insert(expenses).values(expenseInserts).returning();
//       }

//       return {
//         ...budget,
//         expense_categories: createdCategories,
//         expenses: createdExpenses,
//       };
//     });
//   }

//   async getBudgetsByUserId(userId: number): Promise<Budget[]> {
//     return await db.select().from(budgets).where(eq(budgets.user_id, userId));
//   }

//   async getBudget(id: number): Promise<Budget | undefined> {
//     const result = await db.select().from(budgets).where(eq(budgets.id, id));
//     return result[0];
//   }

//   // Get complete budget with categories and expenses
//   async getCompleteBudget(id: number): Promise<CompleteBudget | undefined> {
//     const budget = await this.getBudget(id);
//     if (!budget) return undefined;

//     const [categories, expenseList] = await Promise.all([
//       this.getExpenseCategoriesByBudgetId(id),
//       this.getExpensesByBudgetId(id),
//     ]);

//     return {
//       ...budget,
//       expense_categories: categories,
//       expenses: expenseList,
//     };
//   }

//   // Expense operations
//   async createExpense(expense: InsertExpense): Promise<Expense> {
//     const result = await db.insert(expenses).values(expense).returning();
//     return result[0];
//   }

//   async getExpensesByBudgetId(budgetId: number): Promise<Expense[]> {
//     return await db.select().from(expenses).where(eq(expenses.budget_id, budgetId));
//   }

//   // Expense Category operations
//   async createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory> {
//     const result = await db.insert(expenseCategories).values(category).returning();
//     return result[0];
//   }

//   async getExpenseCategoriesByBudgetId(budgetId: number): Promise<ExpenseCategory[]> {
//     return await db.select().from(expenseCategories).where(eq(expenseCategories.budget_id, budgetId));
//   }

//   // Savings Goal operations
//   async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
//     const result = await db.insert(savingsGoals).values(goal).returning();
//     return result[0];
//   }

//   async getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]> {
//     return await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
//   }

//   async deleteSavingsGoal(id: number): Promise<boolean> {
//     const result = await db
//       .delete(savingsGoals)
//       .where(eq(savingsGoals.id, id))
//       .returning();
//     return result.length > 0;
//   }
// }

// // Keep the memory storage for testing
// export class MemStorage implements IStorage {
//   private users: Map<number, User>;
//   private budgets: Map<number, Budget>;
//   private expenses: Map<number, Expense>;
//   private expenseCategories: Map<number, ExpenseCategory>;
//   private savingsGoals: Map<number, SavingsGoal>;
//   private mortgageCalculations: Map<number, MortgageCalculation>;
//   private emiCalculations: Map<number, EmiCalculation>;
//   private retirementCalculations: Map<number, RetirementCalculation>;
//   private salaryManagement: Map<number, SalaryManagement>;
//   private roiCalculations: Map<number, RoiCalculation>;
//   // private currencies: Map<number, Currency>;
//   // private savingsTracker: Map<number, SavingsTracker>;
//   currentId: number;

//   constructor() {
//     this.users = new Map();
//     this.budgets = new Map();
//     this.expenses = new Map();
//     this.expenseCategories = new Map();
//     this.savingsGoals = new Map();
//     this.mortgageCalculations = new Map();
//     this.emiCalculations = new Map();
//     this.retirementCalculations = new Map();
//     this.salaryManagement = new Map();
//     this.roiCalculations = new Map();
//     // this.currencies = new Map();
//     // this.savingsTracker = new Map();
//     this.currentId = 1;
//   }

//   async getUser(id: number): Promise<User | undefined> {
//     return this.users.get(id);
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(
//       (user) => user.username === username,
//     );
//   }

//   async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(
//       (user) => user.auth0_id === auth0Id,
//     );
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     const id = this.currentId++;
//     const user = {
//       id,
//       username: insertUser.username,
//       // password: insertUser.password,
//       auth0_id: insertUser.auth0_id,
//       email: insertUser.email,
//       created_at: new Date()
//     };
//     this.users.set(id, user);
//     return user;
//   }

//   // Implement other methods for memory storage...
//   async createBudget(budget: InsertBudget): Promise<Budget> {
//     const id = this.currentId++;
//     const newBudget = {
//       id,
//       ...budget,
//       created_at: new Date(),
//       updated_at: new Date()
//     };
//     this.budgets.set(id, newBudget);
//     return newBudget;
//   }

//   async createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget> {
//     const budgetId = this.currentId++;
    
//     // Create budget
//     const budget = {
//       id: budgetId,
//       user_id: budgetData.user_id,
//       name: budgetData.name,
//       total_income: budgetData.total_income,
//       created_at: new Date(),
//       updated_at: new Date()
//     };
//     this.budgets.set(budgetId, budget);

//     let createdCategories: ExpenseCategory[] = [];
//     let createdExpenses: Expense[] = [];

//     // Create categories
//     if (budgetData.expense_categories) {
//       createdCategories = budgetData.expense_categories.map(cat => {
//         const categoryId = this.currentId++;
//         const category = {
//           id: categoryId,
//           budget_id: budgetId,
//           category_id: cat.id,
//           name: cat.name,
//           color: cat.color,
//           amount: cat.amount,
//           created_at: new Date()
//         };
//         this.expenseCategories.set(categoryId, category);
//         return category;
//       });
//     }

//     // Create expenses
//     if (budgetData.expenses) {
//       const categoryMap = new Map(createdCategories.map(cat => [cat.category_id, cat.id]));
      
//       createdExpenses = budgetData.expenses.map(exp => {
//         const expenseId = this.currentId++;
//         const categoryDbId = categoryMap.get(exp.category);
//         if (!categoryDbId) {
//           throw new Error(`Category not found for expense: ${exp.description}`);
//         }

//         const expense = {
//           id: expenseId,
//           budget_id: budgetId,
//           expense_id: exp.id,
//           category_id: categoryDbId,
//           description: exp.description,
//           amount: exp.amount.toString(),
//           date: new Date(exp.date),
//           created_at: new Date()
//         };
//         this.expenses.set(expenseId, expense);
//         return expense;
//       });
//     }

//     return {
//       ...budget,
//       expense_categories: createdCategories,
//       expenses: createdExpenses,
//     };
//   }

//   async getBudgetsByUserId(userId: number): Promise<Budget[]> {
//     return Array.from(this.budgets.values()).filter(budget => budget.user_id === userId);
//   }

//   async getBudget(id: number): Promise<Budget | undefined> {
//     return this.budgets.get(id);
//   }

//   async getCompleteBudget(id: number): Promise<CompleteBudget | undefined> {
//     const budget = this.budgets.get(id);
//     if (!budget) return undefined;

//     const categories = Array.from(this.expenseCategories.values()).filter(cat => cat.budget_id === id);
//     const expenseList = Array.from(this.expenses.values()).filter(exp => exp.budget_id === id);

//     return {
//       ...budget,
//       expense_categories: categories,
//       expenses: expenseList,
//     };
//   }

//   async createExpense(expense: InsertExpense): Promise<Expense> {
//     const id = this.currentId++;
//     const newExpense = {
//       id,
//       ...expense,
//       created_at: new Date()
//     };
//     this.expenses.set(id, newExpense);
//     return newExpense;
//   }

//   async getExpensesByBudgetId(budgetId: number): Promise<Expense[]> {
//     return Array.from(this.expenses.values()).filter(expense => expense.budget_id === budgetId);
//   }

//   async createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory> {
//     const id = this.currentId++;
//     const newCategory = {
//       id,
//       ...category,
//       created_at: new Date()
//     };
//     this.expenseCategories.set(id, newCategory);
//     return newCategory;
//   }

//   async getExpenseCategoriesByBudgetId(budgetId: number): Promise<ExpenseCategory[]> {
//     return Array.from(this.expenseCategories.values()).filter(category => category.budget_id === budgetId);
//   }

//   async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
//     const id = this.currentId++;
//     const newGoal = {
//       id,
//       ...goal,
//       created_at: new Date(),
//       updated_at: new Date()
//     };
//     this.savingsGoals.set(id, newGoal);
//     return newGoal;
//   }

//   async getSavingsGoalsByUserId(userId: number): Promise<SavingsGoal[]> {
//     return Array.from(this.savingsGoals.values()).filter(goal => goal.userId === userId);
//   }

//   // Mortgage calculation methods
//   async createMortgageCalculation(data: InsertMortgageCalculation): Promise<MortgageCalculation> {
//     const id = this.currentId++;
//     const newCalc: MortgageCalculation = {
//       id,
//       created_at: new Date(),
//       ...data,
//     };
//     this.mortgageCalculations.set(id, newCalc);
//     return newCalc;
//   }

//   async getMortgageCalculationsByUserId(userId: number): Promise<MortgageCalculation[]> {
//     return Array.from(this.mortgageCalculations.values()).filter(calc => calc.userId === userId);
//   }

//   // EMI calculation methods
//   async createEmiCalculation(data: InsertEmiCalculation): Promise<EmiCalculation> {
//     const id = this.currentId++;
//     const newCalc: EmiCalculation = {
//       id,
//       created_at: new Date(),
//       ...data,
//     };
//     this.emiCalculations.set(id, newCalc);
//     return newCalc;
//   }

//   async getEmiCalculationsByUserId(userId: number): Promise<EmiCalculation[]> {
//     return Array.from(this.emiCalculations.values()).filter(calc => calc.userId === userId);
//   }

//   // Retirement calculation methods
//   async createRetirementCalculation(data: InsertRetirementCalculation): Promise<RetirementCalculation> {
//     const id = this.currentId++;
//     const newCalc: RetirementCalculation = {
//       id,
//       created_at: new Date(),
//       updated_at: new Date(),
//       ...data,
//     };
//     this.retirementCalculations.set(id, newCalc);
//     return newCalc;
//   }

//   async getRetirementCalculationsByUserId(userId: number): Promise<RetirementCalculation[]> {
//     return Array.from(this.retirementCalculations.values()).filter(calc => calc.userId === userId);
//   }

//   // Salary management methods
//   async createSalaryManagement(data: InsertSalaryManagement): Promise<SalaryManagement> {
//     const id = this.currentId++;
//     const newSalary: SalaryManagement = {
//       id,
//       created_at: new Date(),
//       updated_at: new Date(),
//       ...data,
//     };
//     this.salaryManagement.set(id, newSalary);
//     return newSalary;
//   }

//   async getSalaryManagementByUserId(userId: number): Promise<SalaryManagement[]> {
//     return Array.from(this.salaryManagement.values()).filter(salary => salary.userId === userId);
//   }

//   // ROI calculation methods
//   async createRoiCalculation(data: InsertRoiCalculation): Promise<RoiCalculation> {
//     const id = this.currentId++;
//     const newCalc: RoiCalculation = {
//       id,
//       created_at: new Date(),
//       updated_at: new Date(),
//       ...data,
//     };
//     this.roiCalculations.set(id, newCalc);
//     return newCalc;
//   }

//   async getRoiCalculationsByUserId(userId: number): Promise<RoiCalculation[]> {
//     return Array.from(this.roiCalculations.values()).filter(calc => calc.userId === userId);
//   }

//   // Currency methods
//   // async createCurrency(data: InsertCurrency): Promise<Currency> {
//   //   const id = this.currentId++;
//   //   const newCurrency: Currency = {
//   //     id,
//   //     created_at: new Date(),
//   //     ...data,
//   //   };
//   //   this.currencies.set(id, newCurrency);
//   //   return newCurrency;
//   // }

//   // async getCurrencies(): Promise<Currency[]> {
//   //   return Array.from(this.currencies.values());
//   // }

//   // Savings tracker methods
//   // async createSavingsTracker(data: InsertSavingsTracker): Promise<SavingsTracker> {
//   //   const id = this.currentId++;
//   //   const newTracker: SavingsTracker = {
//   //     id,
//   //     created_at: new Date(),
//   //     updated_at: new Date(),
//   //     ...data,
//   //   };
//   //   this.savingsTracker.set(id, newTracker);
//   //   return newTracker;
//   // }

//   // async getSavingsTrackersByUserId(userId: number): Promise<SavingsTracker[]> {
//   //   return Array.from(this.savingsTracker.values()).filter(tracker => tracker.userId === userId);
//   // }
// }

// // Use database storage in production, memory storage in development/testing
// export const storage = process.env.NODE_ENV === 'production' 
//   ? new DatabaseStorage() 
//   : new DatabaseStorage(); // Change to MemStorage() for testing