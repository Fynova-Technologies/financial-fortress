import React, { useEffect }from "react";
import { BudgetData, Expense, ExpenseCategory } from "./types";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify"
import {
  defaultBudgetData,
  addExpenseCategoryImpl,
  updateExpenseCategoryImpl,
  deleteExpenseCategoryImpl,
  addExpenseImpl,
  updateExpenseImpl,
  deleteExpenseImpl,
} from "./services/budget";


interface BudgetCalculatorContextType {
      // Budget
      budgetData: BudgetData;
      updateBudgetData: (data: Partial<BudgetData>) => void;
      addExpenseCategory: (category: ExpenseCategory) => void;
      updateExpenseCategory: (id: string,category: Partial<ExpenseCategory>) => void;
      deleteExpenseCategory: (id: string) => void;
      addExpense: (expense: Expense) => void;
      updateExpense: (id: string, expense: Partial<Expense>) => void;
      deleteExpense: (id: string) => void;
    
      // Server sync functions
      loadBudgetFromServer: () => Promise<void>;
      saveBudgetToServer: () => Promise<void>;
      isSaving: boolean;
      lastSaved: Date | null;
}

const BudgetCalculatorContext = React.createContext<BudgetCalculatorContextType | undefined>(undefined);

export const useBudgetCalculator = (): BudgetCalculatorContextType => {
  const context = React.useContext(BudgetCalculatorContext);
  if (!context) {
    throw new Error("useBudgetCalculator must be used within a BudgetCalculatorProvider");
  }
  return context;
}
export const BudgetCalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgetData, setBudgetData] = React.useState<BudgetData>(defaultBudgetData);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const { user, getAccessTokenSilently } = useAuth0();

  // Load budget from server on mount and when user changes
  useEffect(() => {
    if (user) {
      loadBudgetFromServer();
    }
  }, [user]);

  const updateBudgetData = (data: Partial<BudgetData>) => {
    setBudgetData((prev) => ({ ...prev, ...data }));
  };

  const addExpenseCategory = (category: ExpenseCategory) => {
    setBudgetData((prev) => addExpenseCategoryImpl(prev, category));
  };

  const updateExpenseCategory = (id: string, category: Partial<ExpenseCategory>) => {
    setBudgetData((prev) => updateExpenseCategoryImpl(prev, id, category));
  };

  const deleteExpenseCategory = (id: string) => {
    setBudgetData((prev) => deleteExpenseCategoryImpl(prev, id));
  };

  const addExpense = (expense: Expense) => {
    setBudgetData((prev) => addExpenseImpl(prev, expense));
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setBudgetData((prev) => updateExpenseImpl(prev, id, expense));
  };

  const deleteExpense = (id: string) => {
    setBudgetData((prev) => deleteExpenseImpl(prev, id));
  };

  // ---------- Server Sync Functions ----------
  const loadBudgetFromServer = async () => {
    try {
      if (!user || !getAccessTokenSilently) return;
      
      const token = await getAccessTokenSilently();
      const res = await fetch("https://financial-fortress.onrender.com/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      
      if (!res.ok) {
        console.error(`HTTP error! status: ${res.status}`);
        return;
      }
      
      const budgets = await res.json();
      
      if (budgets && budgets.length > 0) {
        const latest = budgets[0];

        // Map server categories to frontend shape
        const categories = (latest.expenseCategories || latest.expense_categories || []).map(
          (c: any) => ({
            id: c.category_id || String(c.id),
            category_id: c.category_id || String(c.id),
            name: c.name || "",
            color: c.color || "#3B82F6",
            amount: Number(c.amount) || 0,
          })
        );

        // Map DB numeric category FK -> category_id for expenses if needed
        const dbIdToUuid = new Map<number, string>();
        (latest.expenseCategories || latest.expense_categories || []).forEach((c: any) => {
          if (c.id != null)
            dbIdToUuid.set(Number(c.id), c.category_id || String(c.id));
        });

        const expenses = (latest.expenses || []).map((e: any) => ({
          id: e.expense_id || String(e.id),
          category: e.category || dbIdToUuid.get(Number(e.category_id)) || "",
          amount: Number(e.amount) || 0,
          date: e.date ? new Date(e.date).toISOString().split('T')[0] : "",
          description: e.description || "",
        }));

        const totalIncome = Number(latest.total_income) || 0;

        setBudgetData({
          totalIncome: totalIncome,
          expenseCategories: categories.length ? categories : defaultBudgetData.expenseCategories,
          expenses,
          totalExpenses: expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0),
        });
      } else {
        // No budgets on server, keep defaults
        setBudgetData(defaultBudgetData);
      }
    } catch (err) {
      console.error("Failed to load budget:", err);
    }
  };

  const saveBudgetToServer = async () => {
    try {
      if (!user || !getAccessTokenSilently || isSaving) return;
      
      setIsSaving(true);
      const token = await getAccessTokenSilently();
      
      // Check if we have existing budgets
      const getRes = await fetch("https://financial-fortress.onrender.com/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      
      const existingBudgets = getRes.ok ? await getRes.json() : [];
      
      const payload = {
        name: "My Budget",
        total_income: budgetData.totalIncome,
        expenseCategories: budgetData.expenseCategories.map(cat => ({
          id: cat.category_id,
          category_id: cat.category_id,
          name: cat.name,
          color: cat.color,
          amount: cat.amount.toString(),
        })),
        expenses: budgetData.expenses.map(exp => ({
          id: exp.id,
          expense_id: exp.id,
          description: exp.description,
          category: exp.category,
          date: exp.date,
          amount: exp.amount,
        })),
      };

      let response;
      if (existingBudgets && existingBudgets.length > 0) {
        // Update existing budget
        response = await fetch(`https://financial-fortress.onrender.com/api/budgets/${existingBudgets[0].id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        // Create new budget
        response = await fetch("https://financial-fortress.onrender.com/api/budgets", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorData}`);
      }

      setLastSaved(new Date());
      console.log("Budget saved successfully");
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to save budget. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

    return (
      <BudgetCalculatorContext.Provider
        value={{
          budgetData,
          updateBudgetData,
          addExpenseCategory,
          updateExpenseCategory,
          deleteExpenseCategory,
          addExpense,
          updateExpense,
          deleteExpense,
          loadBudgetFromServer,
          saveBudgetToServer,
          isSaving,
          lastSaved,
        }}
      >
        {children}
      </BudgetCalculatorContext.Provider>
    );
}
export default BudgetCalculatorContext;