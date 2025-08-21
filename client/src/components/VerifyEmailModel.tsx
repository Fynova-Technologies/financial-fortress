import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";

interface VerifyModalProps {
  onBack?: () => void;
}

export default function VerifyModal({ onBack }: VerifyModalProps) {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [, setLocation] = useLocation();

  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [checking, setChecking] = useState(false);

  // Small cooldown so users can't spam resend
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-check verification status every 5 seconds
  React.useEffect(() => {
    if (!isAuthenticated || !user || user.email_verified) return;

    const interval = setInterval(async () => {
      try {
        const resp = await fetch(`http://localhost:5000/api/check-email-verified-public?user_id=${encodeURIComponent(user?.sub ?? "")}`);
        if (resp.ok) {
          const json = await resp.json();
          if (json.email_verified) {
            // Clear the "seen" flag and reload to get fresh user data
            localStorage.removeItem(`user_seen_${user.sub}`);
            window.location.href = '/'; // Full navigation refresh
          }
        }
      } catch (err) {
        console.log('Auto-check failed:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user) return null;

  async function resendVerification() {
    if (cooldown > 0) return;
    setSending(true);
    setError(null);
    setSentMsg(null);
    
    try {
      const token = await getAccessTokenSilently();
      
      const res = await fetch("http://localhost:5000/api/resend-verification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user?.sub })
      });

      // Check if response has content before parsing JSON
      const text = await res.text();
      let json;
      
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text);
        throw new Error('Invalid response from server');
      }

      if (!res.ok) {
        throw new Error(json.error || `Server error: ${res.status}`);
      }

      setSentMsg("Verification email sent — check your inbox (and spam).");
      setCooldown(60); // 60s cooldown
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err?.message || "Failed to send verification email.");
    } finally {
      setSending(false);
    }
  }

  // Ask server to check Auth0 user record for latest email_verified state
  async function checkVerified() {
    setChecking(true);
    setError(null);
    try {
      const resp = await fetch(`http://localhost:5000/api/check-email-verified-public?user_id=${encodeURIComponent(user?.sub ?? "")}`);
      
      const text = await resp.text();
      let json;
      
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!resp.ok) throw new Error(json.error || JSON.stringify(json));
      
      if (json.email_verified) {
        // Clear the tracking flag and do full page refresh
        localStorage.removeItem(`user_seen_${user?.sub}`);
        window.location.href = '/';
      } else {
        setError("Email still unverified. Click the link in your email, then press 'I verified'.");
      }
    } catch (err: any) {
      console.error('Check verification error:', err);
      setError(err?.message || "Failed to check verification status.");
    } finally {
      setChecking(false);
    }
  }

  // Handle back button
  // function handleBack() {
  //   if (onBack) {
  //     onBack();
  //   }
  //   // Clear tracking and go to home
  //   localStorage.removeItem(`user_seen_${user?.sub}`);
  //   setLocation("/");
  // }

  React.useEffect(() => {
  if (!isAuthenticated || !user || user.email_verified) return;

  const interval = setInterval(async () => {
    const resp = await fetch(`http://localhost:5000/api/check-email-verified-public?user_id=${user.sub}`);
    const data = await resp.json();
    if (data.email_verified) {
      window.location.reload(); // refresh user session
    }
  }, 5000);

  return () => clearInterval(interval);
}, [user, isAuthenticated]);


  return (
    <div style={{ width: 650, maxWidth: "100%" }} className="bg-white rounded-lg p-8 shadow-lg text-center relative">
      {/* Back button */}
      {/* <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
        style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer" }}
      >
        ← Back
      </button> */}

      {/* Header icon */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 48, color: "#6b46c1" }}>🔐</div>
      </div>

      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Verify your email</h2>

      <p style={{ color: "#444", marginBottom: 20 }}>
        We sent a verification link to <strong>{user?.email}</strong>. Please open the email and click the verification link.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 12 }}>
        <button
          onClick={resendVerification}
          disabled={sending || cooldown > 0}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            background: "#fff",
            border: "1px solid #ddd",
            cursor: sending || cooldown > 0 ? "not-allowed" : "pointer"
          }}
        >
          {cooldown > 0 ? `Resend (${cooldown}s)` : sending ? "Sending..." : "Resend verification"}
        </button>

        <button
          onClick={checkVerified}
          disabled={checking}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            background: "#5b6cff",
            color: "white",
            border: "none",
            cursor: checking ? "not-allowed" : "pointer"
          }}
        >
          {checking ? "Checking..." : "I verified — check now"}
        </button>
      </div>

      {sentMsg && <div style={{ color: "green", marginBottom: 8 }}>{sentMsg}</div>}
      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

      <p style={{ fontSize: 13, color: "#666" }}>
        Didn't receive the email? Check your spam/promotions folder, or ask to resend. After verifying, press "I verified — check now".
      </p>
    </div>
  );
}

