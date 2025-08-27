import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  MortgageRequest,
  Auth0Request,
} from "../types";

const router = express.Router();

/* Mortgage create/get */
router.post("/mortgage-calculations", checkJwt, async (req: MortgageRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      homePrice,
      downPaymentAmount,
      downPaymentPercent,
      interestRate,
      loanTerm,
      propertyTax,
      homeInsurance,
      pmi,
    } = req.body;

    const mortgageCalculation = await storage.createMortgageCalculation({
      userId: user.id,
      homePrice,
      downPaymentAmount,
      downPaymentPercent,
      interestRate: interestRate.toString(),
      loanTerm,
      propertyTax,
      homeInsurance,
      pmi,
    });

    res.status(201).json(mortgageCalculation);
  } catch (err) {
    console.error("Error creating mortgage calculation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/mortgage-calculations", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = await storage.getMortgageCalculationsByUserId(user.id);
    res.json(list);
  } catch (err) {
    console.error("Error fetching mortgage calculations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;