// //MemStorage (in-memory, for tests/dev)

// import type {
//   User,
//   InsertUser,
//   Budget,
//   InsertBudget,
//   Expense,
//   InsertExpense,
//   ExpenseCategory,
//   InsertExpenseCategory,
//   SavingsGoal,
//   InsertSavingsGoal,
//   InsertMortgageCalculation,
//   MortgageCalculation,
//   InsertEmiCalculation,
//   EmiCalculation,
//   InsertRetirementCalculation,
//   RetirementCalculation,
//   InsertSalaryManagement,
//   SalaryManagement,
//   InsertRoiCalculation,
//   RoiCalculation,
// } from "../models/index.js";

// import type { IStorage, CreateBudgetRequest, CompleteBudget } from "./types.js";

// /**
//  * MemStorage - simple in-memory implementation (useful for tests)
//  */
// export class MemStorage implements IStorage {
//   private users = new Map<number, User>();
//   private budgets = new Map<number, Budget>();
//   private expenses = new Map<number, Expense>();
//   private expenseCategories = new Map<number, ExpenseCategory>();
//   private savingsGoals = new Map<number, SavingsGoal>();
//   private mortgageCalculations = new Map<number, MortgageCalculation>();
//   private emiCalculations = new Map<number, EmiCalculation>();
//   private retirementCalculations = new Map<number, RetirementCalculation>();
//   private salaryManagement = new Map<number, SalaryManagement>();
//   private roiCalculations = new Map<number, RoiCalculation>();
//   private id = 1;

//   private nextId() { return this.id++; }

//   // user
//   async getUser(id: number) { return this.users.get(id); }

//   async getUserByUsername(username: string) {
//     return Array.from(this.users.values()).find(u => u.username === username);
//   }

//   async getUserByAuth0Id(auth0Id: string) {
//     return Array.from(this.users.values()).find(u => u.auth0_id === auth0Id);
//   }

//   async getUserbyEmail(email: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(u => u.email === email);
//   }

//   async createUser(insertUser: InsertUser) {
//     const id = this.nextId();
//     const u: User = {
//       id,
//       username: insertUser.username,
//       auth0_id: insertUser.auth0_id,
//       email: insertUser.email,
//       created_at: new Date(),
//     } as unknown as User;
//     this.users.set(id, u);
//     return u;
//   }

//   // budgets
//   async createBudget(budget: InsertBudget) {
//     const id = this.nextId();
//     const newBudget: Budget = { id, ...budget, created_at: new Date(), updated_at: new Date() } as unknown as Budget;
//     this.budgets.set(id, newBudget);
//     return newBudget;
//   }

//   async createCompleteBudget(budgetData: CreateBudgetRequest): Promise<CompleteBudget> {
//     const budgetId = this.nextId();
//     const budget: Budget = {
//       id: budgetId,
//       user_id: budgetData.user_id,
//       name: budgetData.name,
//       total_income: budgetData.total_income,
//       created_at: new Date(),
//       updated_at: new Date(),
//     } as unknown as Budget;
//     this.budgets.set(budgetId, budget);

//     const createdCategories: ExpenseCategory[] = [];
//     const createdExpenses: Expense[] = [];

//     if (budgetData.expense_categories) {
//       for (const c of budgetData.expense_categories) {
//         const categoryId = this.nextId();
//         const category = {
//           id: categoryId,
//           budget_id: budgetId,
//           category_id: c.id,
//           name: c.name,
//           color: c.color,
//           amount: c.amount,
//           created_at: new Date(),
//         } as unknown as ExpenseCategory;
//         this.expenseCategories.set(categoryId, category);
//         createdCategories.push(category);
//       }
//     }

//     if (budgetData.expenses) {
//       const map = new Map(createdCategories.map(cc => [cc.category_id, cc.id]));
//       for (const e of budgetData.expenses) {
//         const categoryDbId = map.get(e.category);
//         if (!categoryDbId) throw new Error(`Category not found for expense ${e.description}`);
//         const expenseId = this.nextId();
//         const expense = {
//           id: expenseId,
//           budget_id: budgetId,
//           expense_id: e.id,
//           category_id: categoryDbId,
//           description: e.description,
//           amount: e.amount.toString(),
//           date: new Date(e.date),
//           created_at: new Date(),
//         } as unknown as Expense;
//         this.expenses.set(expenseId, expense);
//         createdExpenses.push(expense);
//       }
//     }

//     return { ...budget, expense_categories: createdCategories, expenses: createdExpenses };
//   }

//   async getBudgetsByUserId(userId: number) {
//     return Array.from(this.budgets.values()).filter(b => b.user_id === userId);
//   }

//   async getBudget(id: number) { return this.budgets.get(id); }

//   async getCompleteBudget(id: number) {
//     const b = this.budgets.get(id);
//     if (!b) return undefined;
//     const cats = Array.from(this.expenseCategories.values()).filter(c => c.budget_id === id);
//     const exps = Array.from(this.expenses.values()).filter(e => e.budget_id === id);
//     return { ...b, expense_categories: cats, expenses: exps } as CompleteBudget;
//   }

//   // expenses & categories
//   async createExpense(expense: InsertExpense) {
//     const id = this.nextId();
//     const e: Expense = { id, ...expense, created_at: new Date() } as unknown as Expense;
//     this.expenses.set(id, e);
//     return e;
//   }

//   async getExpensesByBudgetId(budgetId: number) {
//     return Array.from(this.expenses.values()).filter(e => e.budget_id === budgetId);
//   }

//   async createExpenseCategory(category: InsertExpenseCategory) {
//     const id = this.nextId();
//     const c: ExpenseCategory = { id, ...category, created_at: new Date() } as unknown as ExpenseCategory;
//     this.expenseCategories.set(id, c);
//     return c;
//   }

//   async getExpenseCategoriesByBudgetId(budgetId: number) {
//     return Array.from(this.expenseCategories.values()).filter(c => c.budget_id === budgetId);
//   }

//   // savings goals
//   async createSavingsGoal(goal: InsertSavingsGoal) {
//     const id = this.nextId();
//     const g: SavingsGoal = { id, ...goal, created_at: new Date(), updated_at: new Date() } as unknown as SavingsGoal;
//     this.savingsGoals.set(id, g);
//     return g;
//   }

//   async getSavingsGoalsByUserId(userId: number) {
//     return Array.from(this.savingsGoals.values()).filter(g => g.userId === userId);
//   }

//   async deleteSavingsGoal(id: number) {
//     return this.savingsGoals.delete(id);
//   }

//   // mortgage
//   async createMortgageCalculation(data: InsertMortgageCalculation) {
//     const id = this.nextId();
//     const row: MortgageCalculation = { id, created_at: new Date(), ...data } as unknown as MortgageCalculation;
//     this.mortgageCalculations.set(id, row);
//     return row;
//   }

//   async getMortgageCalculationsByUserId(userId: number) {
//     return Array.from(this.mortgageCalculations.values()).filter(r => r.userId === userId);
//   }

//   // emi
//   async createEmiCalculation(data: InsertEmiCalculation) {
//     const id = this.nextId();
//     const row: EmiCalculation = { id, created_at: new Date(), ...data } as unknown as EmiCalculation;
//     this.emiCalculations.set(id, row);
//     return row;
//   }

//   async getEmiCalculationsByUserId(userId: number) {
//     return Array.from(this.emiCalculations.values()).filter(r => r.userId === userId);
//   }

//   // retirement
//   async createRetirementCalculation(data: InsertRetirementCalculation) {
//     const id = this.nextId();
//     const row: RetirementCalculation = { id, created_at: new Date(), updated_at: new Date()} as unknown as RetirementCalculation;
//     this.retirementCalculations.set(id, row);
//     return row;
//   }

//   async getRetirementCalculationsByUserId(userId: number) {
//     return Array.from(this.retirementCalculations.values()).filter(r => r.userId === userId);
//   }

//   // salary
//   async createSalaryManagement(data: InsertSalaryManagement) {
//     const id = this.nextId();
//     const row: SalaryManagement = { id, created_at: new Date(), updated_at: new Date(), ...data } as unknown as SalaryManagement;
//     this.salaryManagement.set(id, row);
//     return row;
//   }

//   async getSalaryManagementByUserId(userId: number) {
//     return Array.from(this.salaryManagement.values()).filter(r => r.userId === userId);
//   }

//   // roi
//   async createRoiCalculation(data: InsertRoiCalculation) {
//     const id = this.nextId();
//     const row: RoiCalculation = { id, created_at: new Date(), updated_at: new Date(), ...data } as unknown as RoiCalculation;
//     this.roiCalculations.set(id, row);
//     return row;
//   }

//   async getRoiCalculationsByUserId(userId: number) {
//     return Array.from(this.roiCalculations.values()).filter(r => r.userId === userId);
//   }
// }
