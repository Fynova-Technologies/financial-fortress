
import {
  BudgetData,
  Expense,
  ExpenseCategory,
} from "../types";

export const defaultBudgetData: BudgetData = {
  totalIncome: 0,
  totalExpenses: 0,
  expenseCategories: [
    { id: "1", name: "Housing", amount: 0, color: "#3B82F6" },
    { id: "2", name: "Food", amount: 0, color: "#10B981" },
    { id: "3", name: "Transportation", amount: 0, color: "#F59E0B" },
    { id: "4", name: "Utilities", amount: 0, color: "#EF4444" },
    { id: "5", name: "Entertainment", amount: 0, color: "#8B5CF6" },
    { id: "6", name: "Other", amount: 0, color: "#EC4899" },
  ],
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
  const existingCategory = prev.expenseCategories.find(
    (cat) => cat.name === expense.category
  );

  let updatedCategories = prev.expenseCategories;
  if (existingCategory) {
    updatedCategories = updatedCategories.map((cat) =>
      cat.name === expense.category ? { ...cat, amount: cat.amount + expense.amount } : cat
    );
  } else {
    updatedCategories = [
      ...updatedCategories,
      { id: crypto.randomUUID(), name: expense.category, amount: expense.amount, color: "#3B82F6" },
    ];
  }

  return {
    ...prev,
    expenses: updatedExpenses,
    expenseCategories: updatedCategories,
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
