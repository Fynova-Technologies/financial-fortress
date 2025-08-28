
import express from "express";
import type { BudgetRequest, Auth0Request } from "../types";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";

const router = express.Router();

/* Create budget */
router.post("/budgets", checkJwt, async (req: BudgetRequest, res) => {
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
      total_income: total_income != null ? total_income.toString() : "0",
      expense_categories: expenseCategories,
      expenses,
    });

    console.log("Budget data: ", budget);

    res.status(201).json(budget);
  } catch (error: any) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

/* Get budgets for user */
router.get("/budgets", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log("get auth0 id:", auth0_id);
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const budgets = await storage.getBudgetsByUserId(user.id);
    res.json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
