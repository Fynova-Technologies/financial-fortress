import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  EmiRequest,
  Auth0Request,
} from "../types";

const router = express.Router();

router.post("/", checkJwt, async (req: EmiRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { loanAmount, interestRate, loanTerm, termType, startDate } = req.body;

    const emiCalculation = await storage.createEmiCalculation({
      userId: user.id,
      loanAmount,
      interestRate: interestRate.toString(),
      loanTerm,
      termType,
      startDate: new Date(startDate),
    });

    res.status(201).json(emiCalculation);
  } catch (err) {
    console.error("Error creating EMI calculation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = await storage.getEmiCalculationsByUserId(user.id);
    res.json(list);
  } catch (err) {
    console.error("Error fetching EMI calculations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;