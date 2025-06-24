import { Express, Request, Response } from "express";
import { checkJwt } from "../utils/auth0Middleware";
import { Budget } from "../models/Budget";

export default async function budgetsRouter(app: Express) {
  // Prefix all routes with /api/budgets
  const prefix = "/api/budgets";

  // GET /api/budgets
  app.get(prefix, checkJwt, async (req: Request, res: Response) => {
    try {
      // Auth0 puts the user’s sub field on req.user
      //   e.g. "auth0|5fXyz..."
      // @ts-ignore
      const userId: string = req.user.sub;
      const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
      res.json(budgets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not fetch budgets" });
    }
  });

  // POST /api/budgets
  app.post(prefix, checkJwt, async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId: string = req.user.sub;
      const { name, amount } = req.body;

      if (typeof name !== "string" || typeof amount !== "number") {
        return res.status(400).json({ message: "Invalid payload" });
      }

      const budget = new Budget({
        userId,
        name,
        amount,
      });

      await budget.save();
      res.status(201).json(budget);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not save budget" });
    }
  });

  // return anything you need (you return it into `server` in index.ts`)
  return app;
}









// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";

// export async function registerRoutes(app: Express): Promise<Server> {
//   // put application routes here
//   // prefix all routes with /api

//   // use storage to perform CRUD operations on the storage interface
//   // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

//   const httpServer = createServer(app);

//   return httpServer;
// }
