import express from "express";
import storage from "../storage/index.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { sendVerificationEmail } from "../utils/auth0.js";
import type { Auth0Request } from "../types";
import { getManagementToken } from "../utils/auth.js";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface Auth0User {
  email: string;
  nickname: string;
  email_verified: boolean;
}

// --- Helper: fetch full Auth0 user info ---
async function getAuth0User(auth0_id: string): Promise<Auth0User> {
  if (!process.env.AUTH0_DOMAIN) throw new Error("AUTH0_DOMAIN not set");

  const token = await getManagementToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  let res;
  try {
    const encodedId = encodeURIComponent(auth0_id);
    res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodedId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Auth0 request timed out");
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch Auth0 user: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const data = await res.json();
  return {
    email: data.email,
    nickname: data.nickname || (data.email ? data.email.split("@")[0] : ""),
    email_verified: Boolean(data.email_verified),
  };
}

// --- POST /api/users ---
router.post("/users", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized: No Auth0 ID found" });
    }

    // Check if user already exists
    let user = await storage.getUserByAuth0Id(auth0_id);

    if (!user) {
      // Fetch Auth0 user info
      let auth0User: Auth0User;
      try {
        auth0User = await getAuth0User(auth0_id);
      } catch (err: any) {
        return res.status(500).json({
          error: "Failed to fetch user data from Auth0",
          details: err.message,
        });
      }

      const { email, nickname } = auth0User;

      if (!email)
        return res.status(400).json({ error: "User email is required" });

      console.log("Inserting user into Postgres:", {
        auth0_id,
        email,
        username: nickname,
      });
      user = await storage.createUser({ auth0_id, email, username: nickname });
      console.log("Inserted user result:", user);

      // Create new user
      try {
        user = await storage.createUser({
          auth0_id,
          email,
          username: nickname,
        });
      } catch (err: any) {
        return res.status(500).json({
          error: "Failed to create user in database",
          details: err.message,
        });
      }

      // Send verification email if not verified
      if (!auth0User.email_verified) {
        try {
          await sendVerificationEmail(auth0_id);
        } catch (err: any) {
          console.warn("Error sending verification email:", err.message);
        }
      }
    }

    // Return user
    if (!user || !user.id) {
      return res
        .status(500)
        .json({ error: "Failed to process user registration" });
    }

    res.status(200).json(user);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
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
