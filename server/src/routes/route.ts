import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";

/* Routers */
import authRouter from "./auth.routes.js";
import budgetsRouter from "./budget.routes.js";
import mortgageRouter from "./mortgage.routes.js";
import emiRouter from "./emi.routes.js";
import retirementRouter from './retirement.routes.js'
import roiRouter from './roi.routes.js'
import SalaryManagementRouter from "./salaryManagement.routes.js";
import savingsRouter from "./savingGoals.routes.js";
import contactRouter from "./contact.routes.js";
import checkEmailRouter from "./checkMail.routes.js";

//registerRoutes - mounts API routers on the given express app and returns an HTTP server.

export async function registerRoutes(app: Express): Promise<Server> {
  // middlewares
  app.use(express.json());

  // request logger (early)
  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });

  // Mount routers under /api
  // Keep route paths consistent with previous implementation (e.g., /api/register => /api/auth/register)
  app.use("/api", authRouter); // register, protected, profile
  app.use("/api/budgets", budgetsRouter);
  app.use("/api/mortgage-calculations", mortgageRouter);
  app.use("/api/emi-calculations", emiRouter);
  app.use("/api/retirement-calculations", retirementRouter);
  app.use("/api/roi-calculations", roiRouter);
  app.use("/api/salary-management", SalaryManagementRouter);
  app.use("/api/savings-goals", savingsRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/auth", checkEmailRouter);

  // catch-all for 404 on /api
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  const httpServer = createServer(app);
  return httpServer;
}

export default registerRoutes;
