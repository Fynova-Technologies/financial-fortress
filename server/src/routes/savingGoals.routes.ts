// src/server/routes/savingsRoutes.ts
import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type { SavingsGoalArrayRequest, Auth0Request } from "../types";

const router = express.Router();

router.post("/savings-goals", checkJwt, async (req: SavingsGoalArrayRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { savingsGoals } = req.body;
    if (!Array.isArray(savingsGoals) || savingsGoals.length === 0) {
      return res.status(400).json({ error: "savingsGoals must be a non-empty array" });
    }

    const createdGoals = [];
    for (const goalData of savingsGoals) {
      const { name, target_amount, current_amount, target_date } = goalData;
      if (!name || !target_amount || !current_amount || !target_date) {
        return res.status(400).json({
          error: "Each savings goal must have name, target_amount, current_amount, and target_date",
        });
      }

      const savingsGoal = await storage.createSavingsGoal({
        userId: user.id,
        name,
        target_amount,
        current_amount,
        target_date: new Date(target_date),
      });

      createdGoals.push(savingsGoal);
    }

    res.status(201).json({
      message: `Successfully created ${createdGoals.length} savings goals`,
      savingsGoals: createdGoals,
    });
  } catch (err) {
    console.error("Error creating savings goals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/savings-goals", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goals = await storage.getSavingsGoalsByUserId(user.id);
    res.json(goals);
  } catch (err) {
    console.error("Error fetching savings goals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
