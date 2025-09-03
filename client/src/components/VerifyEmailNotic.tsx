
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function VerifyNotice() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isLoading || !isAuthenticated) return null;

  // Auth0 user object usually has `email_verified` boolean
  const emailVerified = user?.email_verified;

  if (emailVerified) return null; // nothing to show

  async function resendVerification() {
    setSending(true);
    setError(null);
    setSentMsg(null);
    try {
      // call your backend endpoint (see server example below)
      const res = await fetch("http://financial-fortress.onrender.com/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.sub }) // user.sub is like "auth0|123..."
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || JSON.stringify(json));
      setSentMsg("Verification email sent — check your inbox (and spam).");
    } catch (err) {
      console.error(err);
      setError("Failed to send verification email. Try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: 12, background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong>Verify your email</strong>
          <div style={{ fontSize: 14 }}>
            We sent a verification link to <em>{user?.email}</em>. Please check your inbox and click the link to verify your email address.
          </div>
        </div>
        <div>
          <button onClick={resendVerification} disabled={sending} style={{ padding: "8px 12px", cursor: sending ? "not-allowed" : "pointer" }}>
            {sending ? "Sending..." : "Resend email"}
          </button>
        </div>
      </div>

      {sentMsg && <div style={{ marginTop: 8, color: "green" }}>{sentMsg}</div>}
      {error && <div style={{ marginTop: 8, color: "red" }}>{error}</div>}
      <div style={{ marginTop: 8, fontSize: 13, color: "#333" }}>
        If you don't receive the email, check your spam folder or contact support. After verifying, refresh this page.
      </div>
    </div>
  );
}
