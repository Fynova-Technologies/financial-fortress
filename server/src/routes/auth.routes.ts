import express from "express";
import storage from "../storage/index.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { sendVerificationEmail } from "../utils/auth0.js";
import type { Auth0Request } from "../types";

const router = express.Router();

router.post("/register", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    const { username, email } = req.body;

    if (!auth0_id || !username || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUserByAuth0 = await storage.getUserByAuth0Id(auth0_id);
    if (existingUserByAuth0) {
      return res
        .status(400)
        .json({ message: "User with this Auth0 ID already exists" });
    }

    const existingUserByUsername = await storage.getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = await storage.createUser({ username, email, auth0_id });

    if (!req.auth?.email_verified) {
      console.warn("User has not verified email yet:", auth0_id);
    } else {
      console.log("User email is verified:", auth0_id);
    }

    // Trigger verification email (best-effort)
    try {
      await sendVerificationEmail(auth0_id);
      console.log("Verification email triggered for:", email);
    } catch (err) {
      console.warn("Failed to trigger verification email:", (err as Error).message);
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/protected", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "No Auth0 ID found" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Access granted!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("/protected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/profile", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("/user/profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
