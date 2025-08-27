import express from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import storage from "../storage/index.js";
import type {
  SalaryManagementRequest,
  Auth0Request,
} from "../types";

const router = express.Router();

router.post("/salary-management", checkJwt, async (req: SalaryManagementRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { grossSalary, taxRate, deductions, bonuses, period } = req.body;

    const salaryManagement = await storage.createSalaryManagement({
      userId: user.id,
      grossSalary,
      taxRate: taxRate.toString(),
      deductions,
      bonuses: bonuses || 0,
      period: period || "monthly",
    });

    res.status(201).json(salaryManagement);
  } catch (err) {
    console.error("Error creating salary management:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/salary-management", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const list = await storage.getSalaryManagementByUserId(user.id);
    res.json(list);
  } catch (err) {
    console.error("Error fetching salary management:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;