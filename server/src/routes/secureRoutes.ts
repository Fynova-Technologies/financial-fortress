import { Router, Request, Response, NextFunction } from "express";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { checkEmailVerified } from "../middleware/checkEmailVerified.js";
import { getManagementToken } from "../utils/auth.js";
import dotenv from 'dotenv'

dotenv.config();

// Define the interface locally in this file
interface AuthRequest extends Request {
  auth?: {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    [key: string]: any;
  };
}

const router = Router();

router.get("/protected", checkEmailVerified, (req: AuthRequest, res: Response) => {
  res.json({ message: "You are verified!", user: req.auth });
});

// POST /api/auth/resend-verification
router.post("/resend-verification", checkJwt, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.auth?.sub;
      if (!userId) {
        res.status(401).json({ error: "Missing user identity" });
        return;
      }

      // Optional: rate limiting logic here

      const mgmtToken = await getManagementToken();
      console.log("mgmtToken", mgmtToken);

      const response = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/verification-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mgmtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Auth0 error:", errorData);
        res.status(response.status).json({ error: errorData });
        return;
      }

          // Parse response safely
    const responseText = await response.text();
    let job;
    try {
      job = responseText ? JSON.parse(responseText) : {};
    } catch {
      job = { status: "sent" };
    }

      // const job = await response.json();
      res.json({ success: true, message: "Verification Email Send Successfully", job });
    } catch (err) {
      console.error("resend-verification error:", err);
      res.status(500).json({ error: "Failed to request verification email" });
    }
  }
);

// GET /api/check-email-verified
router.get("/check-email-verified-public", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      res.status(400).json({ error: "Missing user_id parameter" });
      return;
    }

    const mgmtToken = await getManagementToken();
    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const user = await response.json();
    res.json({ email_verified: user.email_verified || false });
  } catch (err) {
    console.error("check-email-verified error:", err);
    res.status(500).json({ error: "Failed to check verification status" });
  }
});

export default router;
