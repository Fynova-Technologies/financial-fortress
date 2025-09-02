
import {
  BudgetData,
  Expense,
  ExpenseCategory,
} from "../types";

// services/budget.ts (or a new constants file)
export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: "cat-housing",       category_id: "cat-housing",       name: "Housing",        amount: 0, color: "#3B82F6" },
  { id: "cat-food",          category_id: "cat-food",          name: "Food",           amount: 0, color: "#10B981" },
  { id: "cat-transport",     category_id: "cat-transport",     name: "Transportation", amount: 0, color: "#F59E0B" },
  { id: "cat-utilities",     category_id: "cat-utilities",     name: "Utilities",      amount: 0, color: "#EF4444" },
  { id: "cat-entertainment", category_id: "cat-entertainment", name: "Entertainment",  amount: 0, color: "#8B5CF6" },
  { id: "cat-other",         category_id: "cat-other",         name: "Other",          amount: 0, color: "#EC4899" },
];

// defaultBudgetData
export const defaultBudgetData: BudgetData = {
  totalIncome: 0,
  totalExpenses: 0,
  expenseCategories: DEFAULT_CATEGORIES.slice(), // ✅ put them back, as IDs (strings)
  expenses: [],
};


/* Mutation helpers used inside the provider */
export const addExpenseCategoryImpl = (
  prev: BudgetData,
  category: ExpenseCategory
): BudgetData => ({
  ...prev,
  expenseCategories: [...prev.expenseCategories, category],
  totalExpenses: prev.totalExpenses + (category.amount || 0),
});

export const updateExpenseCategoryImpl = (
  prev: BudgetData,
  id: string,
  partial: Partial<ExpenseCategory>
): BudgetData => ({
  ...prev,
  expenseCategories: prev.expenseCategories.map((c) =>
    c.id === id ? { ...c, ...partial } : c
  ),
});

export const deleteExpenseCategoryImpl = (
  prev: BudgetData,
  id: string
): BudgetData => ({
  ...prev,
  expenseCategories: prev.expenseCategories.filter((c) => c.id !== id),
});

export const addExpenseImpl = (prev: BudgetData, expense: Expense): BudgetData => {
  const updatedExpenses = [...prev.expenses, expense];
  return {
    ...prev,
    expenses: updatedExpenses,

    totalExpenses: prev.totalExpenses + expense.amount,
  };
};

export const updateExpenseImpl = (
  prev: BudgetData,
  id: string,
  expensePartial: Partial<Expense>
): BudgetData => {
  const oldExpense = prev.expenses.find((e) => e.id === id);
  const amountDiff =
    oldExpense && expensePartial.amount !== undefined
      ? expensePartial.amount - oldExpense.amount
      : 0;

  return {
    ...prev,
    expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...expensePartial } : e)),
    totalExpenses: prev.totalExpenses + amountDiff,
  };
};

export const deleteExpenseImpl = (prev: BudgetData, id: string): BudgetData => {
  const expense = prev.expenses.find((e) => e.id === id);
  return {
    ...prev,
    expenses: prev.expenses.filter((e) => e.id !== id),
    totalExpenses: expense ? prev.totalExpenses - expense.amount : prev.totalExpenses,
  };
};
