import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  SavingsGoalArrayRequest,
  Auth0Request,
  SavingsGoalDeleteRequest,
} from "../types";
import type { User } from "../models/user.js";

const router = express.Router();

router.post("/", checkJwt, async (req: SavingsGoalArrayRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Incoming goals:", req.body.savingsGoals);
    console.log("User:", user);

    const { savingsGoals } = req.body;
    if (!Array.isArray(savingsGoals) || savingsGoals.length === 0) {
      return res
        .status(400)
        .json({ error: "savingsGoals must be a non-empty array" });
    }

    const createdGoals = [];
    for (const goalData of savingsGoals) {
      const { name, target_amount, current_amount, target_date } = goalData;
      if (!name || !target_amount || !current_amount || !target_date) {
        return res.status(400).json({
          error:
            "Each savings goal must have name, target_amount, current_amount, and target_date",
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

router.get("/", checkJwt, async (req: Auth0Request, res) => {
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

//update
// router.put("/:id", checkJwt, async (req: Auth0Request, res) => {
//   try {
//     const { id } = req.params;
//     const auth0_id = req.auth?.sub;
//     if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

//     const user = await storage.getUserByAuth0Id(auth0_id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const numericId = parseInt(id, 10);
//     if (isNaN(numericId)) return res.status(400).json({ error: "Invalid savings goal ID" });

// const existingGoal = await storage.getSavingsGoalById(numericId, user.id);
// if (!existingGoal) {
//   return res.status(404).json({ error: "Savings goal not found" });
// }

// // TypeScript now knows existingGoal is SavingsGoal
// const updated = await storage.updateSavingsGoal(numericId, user.id, {
//   name: name ?? existingGoal.name,
//   target_amount: target_amount ?? existingGoal.target_amount,
//   current_amount: current_amount ?? existingGoal.current_amount,
//   target_date: target_date ? new Date(target_date) : existingGoal.target_date,
// });

//     res.json(updated);
//   } catch (err) {
//     console.error("Error updating savings goal:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Delete a savings goal
router.delete("/:id", checkJwt, async (req: SavingsGoalDeleteRequest, res) => {
  try {
    const goalId = req.params.id;
    const auth0_id = req.auth?.sub;

    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user: User | undefined = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const numericId = parseInt(goalId, 10);
    if (isNaN(numericId))
      return res.status(400).json({ error: "Invalid savings goal ID" });

    const existingGoal = await storage.getSavingsGoalById(numericId, user.id);
    if (!existingGoal)
      return res.status(404).json({ error: "Savings goal not found" });

    const deleted = await storage.deleteSavingsGoal(numericId, user.id);
    if (!deleted)
      return res.status(500).json({ error: "Failed to delete savings goal" });

    res
      .status(200)
      .json({
        message: "Savings goal deleted successfully",
        deletedGoalId: goalId,
      });
  } catch (error) {
    console.error("Error deleting savings goal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
