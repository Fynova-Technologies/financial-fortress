
import express from "express";
import type { BudgetRequest, Auth0Request } from "../types";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import { ExpenseCategory } from "../models";

const router = express.Router();

/* Create budget */
router.post("/", checkJwt, async (req: BudgetRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log("post auth0 id: ", auth0_id);
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "Post User not found" });

    const { name, total_income, expenseCategories, expenses } = req.body;

    const budget = await storage.createCompleteBudget({
      user_id: user.id,
      name,
      total_income: total_income != null ? Number(total_income) : 0,
      expense_categories: expenseCategories.map((cat: any) => ({
        ...cat,
        amount: Number(cat.amount) || 0, 
      })),
      expenses,
    });

    console.log("Budget data: ", budget);

    res.status(201).json(budget);
  } catch (error: any) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

/* Get budgets for user (with categories + expenses) */
router.get("/", checkJwt, async (req: Auth0Request, res) => {
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
      ...e,
      amount: Number(e.amount),
      category: categoryMap.get(e.category_id) || "", // string ID for frontend
    }));

    return {
      ...budget,
      total_income: Number(budget.total_income),
      expenseCategories: categories.map((c) => ({
        ...c,
        amount: Number(c.amount),
      })),
      expenses: expensesMapped,
    };
  })
);

    res.json(budgetsWithDetails);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
