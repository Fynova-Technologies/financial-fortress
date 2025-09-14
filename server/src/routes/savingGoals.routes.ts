import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js"; // ensure updateSavingsGoal exported
import type { Request } from "express";

const router = express.Router();

// POST create many (your existing handler)
router.post("/", checkJwt, async (req: Request & { auth?: any }, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { savingsGoals } = req.body;
    if (!Array.isArray(savingsGoals) || savingsGoals.length === 0) {
      return res.status(400).json({ error: "savingsGoals must be a non-empty array" });
    }

    const createdGoals: any[] = [];
    for (const g of savingsGoals) {
      const { name, target_amount, current_amount, target_date } = g;
      if (!name || target_amount === undefined || current_amount === undefined || !target_date) {
        return res.status(400).json({ error: "Each goal must have name, target_amount, current_amount, target_date" });
      }

      if (!g.id) {
      const created = await storage.createSavingsGoal({
        userId: user.id,
        name,
        target_amount,
        current_amount,
        target_date: new Date(target_date),
      });

      createdGoals.push(created);
    }
    }

    res.status(201).json({ message: `Created ${createdGoals.length}`, savingsGoals: createdGoals });
  } catch (err) {
    console.error("POST /savings-goals error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all
router.get("/", checkJwt, async (req: Request & { auth?: any }, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goals = await storage.getSavingsGoalsByUserId(user.id);
    res.json(goals);
  } catch (err) {
    console.error("GET /savings-goals error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update
router.put("/:id", checkJwt, async (req: Request & { auth?: any }, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const existing = await storage.getSavingsGoalById(id, user.id);
    if (!existing) return res.status(404).json({ error: "Savings goal not found" });

    const { name, target_amount, current_amount, target_date } = req.body;

    const updated = await storage.updateSavingsGoal(id, user.id, {
      name,
      target_amount: target_amount !== undefined ? Number(target_amount) : undefined,
      current_amount: current_amount !== undefined ? Number(current_amount) : undefined,
      target_date: target_date !== undefined ? new Date(target_date) : undefined,
    });

    if (!updated) return res.status(500).json({ error: "Failed to update" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("PUT /savings-goals/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
router.delete("/:id", checkJwt, async (req: Request & { auth?: any }, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const existing = await storage.getSavingsGoalById(id, user.id);
    if (!existing) return res.status(404).json({ error: "Savings goal not found" });

    const deleted = await storage.deleteSavingsGoal(id, user.id);
    if (!deleted) return res.status(500).json({ error: "Failed to delete" });

    res.status(200).json({ message: "Deleted", deletedGoalId: id });
  } catch (err) {
    console.error("DELETE /savings-goals/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
