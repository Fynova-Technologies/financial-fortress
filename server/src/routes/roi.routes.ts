import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  RoiRequest,
  Auth0Request,
} from "../types";

const router = express.Router();

router.post("/", checkJwt, async (req: RoiRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      initialInvestment,
      additionalContribution,
      contributionFrequency,
      annualRate,
      compoundingFrequency,
      investmentTerm,
    } = req.body;

    const roiCalculation = await storage.createRoiCalculation({
      userId: user.id,
      initialInvestment,
      additionalContribution,
      contributionFrequency,
      annualRate: annualRate.toString(),
      compoundingFrequency,
      investmentTerm,
    });

    res.status(201).json(roiCalculation);
  } catch (err) {
    console.error("Error creating ROI calculation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = await storage.getRoiCalculationsByUserId(user.id);
    res.json(list);
  } catch (err) {
    console.error("Error fetching ROI calculations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;