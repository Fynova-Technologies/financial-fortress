import express from "express";
import type { BudgetCreateRequest, BudgetRequest, BudgetGetRequest } from "../types";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";

const router = express.Router();

// Create budget - no params needed
router.post("/", checkJwt, async (req: BudgetCreateRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log("post auth0 id: ", auth0_id);
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "Post User not found" });

    const { name, total_income, expenseCategories, expenses } = req.body;

    const budget = await storage.createCompleteBudget({
      user_id: user.id,
      name: name || "My Budget",
      total_income: total_income != null ? Number(total_income) : 0,
      expense_categories: (expenseCategories || []).map((cat) => ({
        id: cat.id || cat.category_id || '', // Ensure string, not undefined
        category_id: cat.category_id || cat.id || '', // Ensure string, not undefined
        name: cat.name,
        color: cat.color || "#3B82F6",
        amount: Number(cat.amount) || 0, 
      })),
      expenses: expenses || [],
    });

    console.log("Budget created: ", budget);

    // Format response to match frontend expectations
    const formattedBudget = {
      ...budget,
      total_income: Number(budget.total_income),
      expenseCategories: budget.expense_categories?.map((c: any) => ({
        ...c,
        amount: Number(c.amount),
      })) || [],
      expenses: budget.expenses?.map((e: any) => ({
        ...e,
        amount: Number(e.amount),
      })) || [],
    };

    res.status(201).json(formattedBudget);
  } catch (error: any) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Get budgets - use generic Request type
router.get("/", checkJwt, async (req: BudgetGetRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log("get auth0 id:", auth0_id);
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch budgets
    const budgets = await storage.getBudgetsByUserId(user.id);

    // Attach categories and expenses to each budget
    const budgetsWithDetails = await Promise.all(
      budgets.map(async (budget) => {
        const categories = await storage.getExpenseCategoriesByBudgetId(budget.id);
        const expenses = await storage.getExpensesByBudgetId(budget.id);

        // Build mapping numeric ID -> string category_id
        const categoryMap = new Map<number, string>();
        categories.forEach((c) => categoryMap.set(c.id, c.category_id));

        const expensesMapped = expenses.map((e) => ({
          id: e.expense_id || String(e.id),
          expense_id: e.expense_id || String(e.id),
          category: categoryMap.get(e.category_id) || "",
          category_id: e.category_id,
          amount: Number(e.amount),
          date: e.date ? new Date(e.date).toISOString() : "",
          description: e.description || "",
        }));

        return {
          id: budget.id,
          name: budget.name,
          total_income: Number(budget.total_income),
          expenseCategories: categories.map((c) => ({
            id: c.category_id,
            category_id: c.category_id,
            name: c.name,
            color: c.color,
            amount: Number(c.amount),
          })),
          expense_categories: categories.map((c) => ({
            id: c.id,
            category_id: c.category_id,
            name: c.name,
            color: c.color,
            amount: Number(c.amount),
          })),
          expenses: expensesMapped,
        };
      })
    );

    console.log("Returning budgets:", JSON.stringify(budgetsWithDetails, null, 2));
    res.json(budgetsWithDetails);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* Update existing budget */
router.put("/:id", checkJwt, async (req: BudgetRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Access params safely
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Budget ID is required" });
    }

    const { name, total_income, expenseCategories, expenses } = req.body;

    console.log("Updating budget with data:", { name, total_income, expenseCategories, expenses });

    const updatedBudget = await storage.updateCompleteBudget(Number(id), {
      user_id: user.id,
      name: name || "My Budget",
      total_income: total_income != null ? Number(total_income) : 0,
      expense_categories: (expenseCategories || []).map((cat) => ({
        id: cat.id || cat.category_id || '', // Ensure string, not undefined
        category_id: cat.category_id || cat.id || '', // Ensure string, not undefined
        name: cat.name,
        color: cat.color || "#3B82F6",
        amount: Number(cat.amount) || 0,
      })),
      expenses: expenses || [],
    });

    // Format response
    const formattedBudget = {
      ...updatedBudget,
      total_income: Number(updatedBudget.total_income),
      expenseCategories: updatedBudget.expense_categories?.map((c: any) => ({
        ...c,
        amount: Number(c.amount),
      })) || [],
      expenses: updatedBudget.expenses?.map((e: any) => ({
        ...e,
        amount: Number(e.amount),
      })) || [],
    };

    console.log("Budget updated successfully:", formattedBudget);
    res.json(formattedBudget);
  } catch (error: any) {
    console.error("Error updating budget:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

export default router;