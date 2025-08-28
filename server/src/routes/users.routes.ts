import express from "express";
import { checkJwt } from "../middleware/auth0Middleware";
import storage from "../storage";
import type { UserRequest, Auth0Request } from "../types";

const router = express.Router();

router.post("/users", checkJwt, async (req: UserRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });
    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { id, username, email } = req.body;
  } catch (err) {
    console.error("Error creating users: ", err);
  }
});
