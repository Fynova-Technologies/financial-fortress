import express from "express";
import storage from "../storage/index.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { sendVerificationEmail } from "../utils/auth0.js";
import type { Auth0Request } from "../types";

const router = express.Router();

// Helper: fetch full Auth0 user info
async function getAuth0User(auth0_id: string) {
  const token =
    process.env.AUTH0_MANAGEMENT_TOKEN ||
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVfQnVjTTVldnZsUmRuSGgzYnR6biJ9.eyJpc3MiOiJodHRwczovL2Rldi1sMGNua21ucm40cmVvbWpjLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJRcDdKZ2UxMlFPTFJQVm1mb2ZIaGZUdGZxQjd3UVdWb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtbDBjbmttbnJuNHJlb21qYy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTc1NjcxODcxMCwiZXhwIjoxNzU2ODA1MTEwLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIHJlYWQ6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgZGVsZXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6aG9va3MgdXBkYXRlOmhvb2tzIGRlbGV0ZTpob29rcyBjcmVhdGU6aG9va3MgcmVhZDphY3Rpb25zIHVwZGF0ZTphY3Rpb25zIGRlbGV0ZTphY3Rpb25zIGNyZWF0ZTphY3Rpb25zIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6aW5zaWdodHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpsb2dzX3VzZXJzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyB1cGRhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyByZWFkOmFub21hbHlfYmxvY2tzIGRlbGV0ZTphbm9tYWx5X2Jsb2NrcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyB1cGRhdGU6Y3VzdG9tX2RvbWFpbnMgcmVhZDplbWFpbF90ZW1wbGF0ZXMgY3JlYXRlOmVtYWlsX3RlbXBsYXRlcyB1cGRhdGU6ZW1haWxfdGVtcGxhdGVzIHJlYWQ6bWZhX3BvbGljaWVzIHVwZGF0ZTptZmFfcG9saWNpZXMgcmVhZDpyb2xlcyBjcmVhdGU6cm9sZXMgZGVsZXRlOnJvbGVzIHVwZGF0ZTpyb2xlcyByZWFkOnByb21wdHMgdXBkYXRlOnByb21wdHMgcmVhZDpicmFuZGluZyB1cGRhdGU6YnJhbmRpbmcgZGVsZXRlOmJyYW5kaW5nIHJlYWQ6bG9nX3N0cmVhbXMgY3JlYXRlOmxvZ19zdHJlYW1zIGRlbGV0ZTpsb2dfc3RyZWFtcyB1cGRhdGU6bG9nX3N0cmVhbXMgY3JlYXRlOnNpZ25pbmdfa2V5cyByZWFkOnNpZ25pbmdfa2V5cyB1cGRhdGU6c2lnbmluZ19rZXlzIHJlYWQ6bGltaXRzIHVwZGF0ZTpsaW1pdHMgY3JlYXRlOnJvbGVfbWVtYmVycyByZWFkOnJvbGVfbWVtYmVycyBkZWxldGU6cm9sZV9tZW1iZXJzIHJlYWQ6ZW50aXRsZW1lbnRzIHJlYWQ6YXR0YWNrX3Byb3RlY3Rpb24gdXBkYXRlOmF0dGFja19wcm90ZWN0aW9uIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6YXV0aGVudGljYXRpb25fbWV0aG9kcyB1cGRhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyBkZWxldGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fZGlzY292ZXJ5X2RvbWFpbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9kaXNjb3ZlcnlfZG9tYWlucyBjcmVhdGU6b3JnYW5pemF0aW9uX2Rpc2NvdmVyeV9kb21haW5zIGRlbGV0ZTpvcmdhbml6YXRpb25fZGlzY292ZXJ5X2RvbWFpbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV9jb25maWcgdXBkYXRlOnNjaW1fY29uZmlnIGRlbGV0ZTpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV90b2tlbiByZWFkOnNjaW1fdG9rZW4gZGVsZXRlOnNjaW1fdG9rZW4gZGVsZXRlOnBob25lX3Byb3ZpZGVycyBjcmVhdGU6cGhvbmVfcHJvdmlkZXJzIHJlYWQ6cGhvbmVfcHJvdmlkZXJzIHVwZGF0ZTpwaG9uZV9wcm92aWRlcnMgZGVsZXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6cGhvbmVfdGVtcGxhdGVzIHJlYWQ6cGhvbmVfdGVtcGxhdGVzIHVwZGF0ZTpwaG9uZV90ZW1wbGF0ZXMgY3JlYXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOmVuY3J5cHRpb25fa2V5cyB1cGRhdGU6ZW5jcnlwdGlvbl9rZXlzIGRlbGV0ZTplbmNyeXB0aW9uX2tleXMgcmVhZDpzZXNzaW9ucyBkZWxldGU6c2Vzc2lvbnMgcmVhZDpyZWZyZXNoX3Rva2VucyBkZWxldGU6cmVmcmVzaF90b2tlbnMgY3JlYXRlOnNlbGZfc2VydmljZV9wcm9maWxlcyByZWFkOnNlbGZfc2VydmljZV9wcm9maWxlcyB1cGRhdGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVzIGRlbGV0ZTpzZWxmX3NlcnZpY2VfcHJvZmlsZXMgY3JlYXRlOnNzb19hY2Nlc3NfdGlja2V0cyBkZWxldGU6c3NvX2FjY2Vzc190aWNrZXRzIHJlYWQ6Zm9ybXMgdXBkYXRlOmZvcm1zIGRlbGV0ZTpmb3JtcyBjcmVhdGU6Zm9ybXMgcmVhZDpmbG93cyB1cGRhdGU6Zmxvd3MgZGVsZXRlOmZsb3dzIGNyZWF0ZTpmbG93cyByZWFkOmZsb3dzX3ZhdWx0IHJlYWQ6Zmxvd3NfdmF1bHRfY29ubmVjdGlvbnMgdXBkYXRlOmZsb3dzX3ZhdWx0X2Nvbm5lY3Rpb25zIGRlbGV0ZTpmbG93c192YXVsdF9jb25uZWN0aW9ucyBjcmVhdGU6Zmxvd3NfdmF1bHRfY29ubmVjdGlvbnMgcmVhZDpmbG93c19leGVjdXRpb25zIGRlbGV0ZTpmbG93c19leGVjdXRpb25zIHJlYWQ6Y29ubmVjdGlvbnNfb3B0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnNfb3B0aW9ucyByZWFkOnNlbGZfc2VydmljZV9wcm9maWxlX2N1c3RvbV90ZXh0cyB1cGRhdGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVfY3VzdG9tX3RleHRzIGNyZWF0ZTpuZXR3b3JrX2FjbHMgdXBkYXRlOm5ldHdvcmtfYWNscyByZWFkOm5ldHdvcmtfYWNscyBkZWxldGU6bmV0d29ya19hY2xzIGRlbGV0ZTp2ZGNzX3RlbXBsYXRlcyByZWFkOnZkY3NfdGVtcGxhdGVzIGNyZWF0ZTp2ZGNzX3RlbXBsYXRlcyB1cGRhdGU6dmRjc190ZW1wbGF0ZXMgY3JlYXRlOmN1c3RvbV9zaWduaW5nX2tleXMgcmVhZDpjdXN0b21fc2lnbmluZ19rZXlzIHVwZGF0ZTpjdXN0b21fc2lnbmluZ19rZXlzIGRlbGV0ZTpjdXN0b21fc2lnbmluZ19rZXlzIHJlYWQ6ZmVkZXJhdGVkX2Nvbm5lY3Rpb25zX3Rva2VucyBkZWxldGU6ZmVkZXJhdGVkX2Nvbm5lY3Rpb25zX3Rva2VucyBjcmVhdGU6dXNlcl9hdHRyaWJ1dGVfcHJvZmlsZXMgcmVhZDp1c2VyX2F0dHJpYnV0ZV9wcm9maWxlcyB1cGRhdGU6dXNlcl9hdHRyaWJ1dGVfcHJvZmlsZXMgZGVsZXRlOnVzZXJfYXR0cmlidXRlX3Byb2ZpbGVzIHJlYWQ6ZXZlbnRfc3RyZWFtcyBjcmVhdGU6ZXZlbnRfc3RyZWFtcyBkZWxldGU6ZXZlbnRfc3RyZWFtcyB1cGRhdGU6ZXZlbnRfc3RyZWFtcyByZWFkOmV2ZW50X2RlbGl2ZXJpZXMgdXBkYXRlOmV2ZW50X2RlbGl2ZXJpZXMgY3JlYXRlOmNvbm5lY3Rpb25fcHJvZmlsZXMgcmVhZDpjb25uZWN0aW9uX3Byb2ZpbGVzIHVwZGF0ZTpjb25uZWN0aW9uX3Byb2ZpbGVzIGRlbGV0ZTpjb25uZWN0aW9uX3Byb2ZpbGVzIHJlYWQ6b3JnYW5pemF0aW9uX2NsaWVudF9ncmFudHMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jbGllbnRfZ3JhbnRzIGRlbGV0ZTpvcmdhbml6YXRpb25fY2xpZW50X2dyYW50cyByZWFkOnNlY3VyaXR5X21ldHJpY3MgcmVhZDpjb25uZWN0aW9uc19rZXlzIHVwZGF0ZTpjb25uZWN0aW9uc19rZXlzIGNyZWF0ZTpjb25uZWN0aW9uc19rZXlzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiUXA3SmdlMTJRT0xSUFZtZm9mSGhmVHRmcUI3d1FXVm8ifQ.QknVQ1JuXcxtX5NEJIeO2R_2DB_jLhaQQMd-mdExeyu3NF8CEGuaM8Z0pAngx5wPEI8XlKvgPcZ_V6AL_WXVnpbVR1cH9_ndqQPpcOyrkEbveKBHfhf0CvTyvtv8Y6QaD9JOU-L52Q8s5n1ZuBbdjFVui97jvUK1P59D4MZ_WeVPvcd-brygIUcBlJekT8Fesh8uSaK3fJklR8EOxivFsBw3IwRtn8ZTLNepEsyselvlDA-jpyEj6ie0pdr3D1hsXCmzBC6nqc6YjAtgM10PBLgjkz797FRRG0aOCaDxSU9uU1Xs4GNS59driayBMiaQ3J3hCE2mfxbKJbw1QMOMHQ"; // create a Management API token in Auth0
  const domain =
    process.env.AUTH0_DOMAIN || "dev-l0cnkmnrn4reomjc.us.auth0.com";

  const res = await fetch(`https://${domain}/api/v2/users/${auth0_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Auth0 user: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    email: data.email,
    nickname: data.nickname,
    email_verified: data.email_verified,
  };
}

// POST /api/users - register or get user
router.post("/users", checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    if (!auth0_id) return res.status(401).json({ error: "Unauthorized" });

    // Check if user already exists in DB
    let user = await storage.getUserByAuth0Id(auth0_id);

    if (!user) {
      // Fetch Auth0 user info
      const auth0User = await getAuth0User(auth0_id);
      const email = auth0User.email;
      const username = auth0User.nickname || email.split("@")[0];

      console.log("auth id:", auth0_id);
      console.log("email: ", email);
      console.log("usernmae: ", username);

      // Create new user in DB
      user = await storage.createUser({ auth0_id, email, username });
      console.log("New user created in DB:", user);

      // Optionally send verification email if not verified
      if (!auth0User.email_verified) {
        try {
          const { sendVerificationEmail } = await import("../utils/auth0.js");
          const result = await sendVerificationEmail(auth0_id);
          if (result.success) {
            console.log("Verification email sent:", email);
          }
        } catch (err) {
          console.warn(
            "Failed to send verification email:",
            (err as Error).message
          );
        }
      }
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error handling user:", err);
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
