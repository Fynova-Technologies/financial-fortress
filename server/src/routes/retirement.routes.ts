import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  RetirementRequest,
  Auth0Request,
} from "../types";

const router = express.Router();

router.post("/", checkJwt, async (req: RetirementRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      lifeExpectancy,
      inflationRate,
      desiredMonthlyIncome,
      retirementAge,
      currentAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
    } = req.body;

    const retirementCalculation = await storage.createRetirementCalculation({
      userId: user.id,
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      expectedReturn: expectedReturn.toString(),
      inflationRate: inflationRate.toString(),
      desiredMonthlyIncome,
    });

    res.status(201).json(retirementCalculation);
  } catch (err) {
    console.error("Error creating retirement calculation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = await storage.getRetirementCalculationsByUserId(user.id);
    res.json(list);
  } catch (err) {
    console.error("Error fetching retirement calculations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;