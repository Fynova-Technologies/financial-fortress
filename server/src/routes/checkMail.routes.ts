
import express from "express";
import { getManagementToken } from "../utils/auth.js";

const router = express.Router();

router.get("/check-email-verified-public", async (req, res) => {
  try {
    const userId = (req.query.user_id as string) || "";
    if (!userId) {
      return res.status(400).json({ error: "Missing user_id query parameter" });
    }

    const mgmtToken = await getManagementToken();
    if (!mgmtToken) {
      return res.status(500).json({ error: "Failed to get management token" });
    }

    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "dev-l0cnkmnrn4reomjc.us.auth0.com";
    const response = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || "Auth0 error" });
    }

    const user = await response.json();
    return res.json({ email_verified: !!user.email_verified });
  } catch (err) {
    console.error("check-email-verified-public error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
