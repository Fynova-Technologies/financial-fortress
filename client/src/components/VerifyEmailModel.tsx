import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";

interface VerifyModalProps {
  onBack?: () => void;
}

export default function VerifyModal({ onBack }: VerifyModalProps) {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  const [, setLocation] = useLocation();

  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [checking, setChecking] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Poll verification status every 5 seconds
  useEffect(() => {
    if (!isAuthenticated || !user || user.email_verified) return;

    const interval = setInterval(async () => {
      try {
        const resp = await fetch(
          `http://financial-fortress.onrender.com/api/check-email-verified-public?user_id=${encodeURIComponent(
            user?.sub ?? ""
          )}`
        );
        if (resp.ok) {
          const json = await resp.json();
          if (json.email_verified) {
            localStorage.removeItem(`user_seen_${user.sub}`);
            window.location.href = "/";
          }
        }
      } catch (err) {
        console.log("Auto-check failed:", err);
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
      const res = await fetch("http://financial-fortress.onrender.com/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user?.sub }),
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(json.error || `Server error: ${res.status}`);

      setSentMsg("Verification email sent — check your inbox (and spam).");
      setCooldown(60);
    } catch (err: any) {
      setError(err?.message || "Failed to send verification email.");
    } finally {
      setSending(false);
    }
  }

  async function checkVerified() {
    setChecking(true);
    setError(null);
    try {
      const resp = await fetch(
        `https://financial-fortress.onrender.com/api/check-email-verified-public?user_id=${encodeURIComponent(
          user?.sub ?? ""
        )}`
      );
      const text = await resp.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid response from server");
      }
      if (!resp.ok) throw new Error(json.error || JSON.stringify(json));

      if (json.email_verified) {
        localStorage.removeItem(`user_seen_${user?.sub}`);
        window.location.href = "/";
      } else {
        setError(
          "Email still unverified. Click the link in your email, then press 'I verified'."
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to check verification status.");
    } finally {
      setChecking(false);
    }
  }
  const handleBack = () => {
    localStorage.removeItem(`user_seen_${user?.sub}`);

    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    window.history.replaceState(null, "", "/");
  };

  return (
    <div className="max-w-2xl w-full bg-white rounded-lg p-8 shadow-lg text-center relative">
      {/* Header icon */}
      <button
        onClick={handleBack}
        className="absolute top-4 right-4 text-black hover:text-gray-600 dark:text-gray-900 dark:hover:text-gray-600 text-2xl"
        aria-label="Close"
      >
        ×
      </button>

      <div className="mb-3 text-6xl text-purple-700">🔐</div>

      <h2 className="text-xl font-semibold mb-2">Verify your email</h2>

      <p className="text-gray-700 mb-5">
        We sent a verification link to <strong>{user?.email}</strong>. Please
        open the email and click the verification link.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-3">
        <button
          onClick={resendVerification}
          disabled={sending || cooldown > 0}
          className={`px-4 py-2 rounded-md border ${
            sending || cooldown > 0
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {cooldown > 0
            ? `Resend (${cooldown}s)`
            : sending
            ? "Sending..."
            : "Resend verification"}
        </button>

        <button
          onClick={checkVerified}
          disabled={checking}
          className={`px-4 py-2 rounded-md text-white ${
            checking
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {checking ? "Checking..." : "I verified — check now"}
        </button>
      </div>

      {sentMsg && <div className="text-green-600 mb-2">{sentMsg}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <p className="text-xs text-gray-500">
        Didn't receive the email? Check your spam/promotions folder, or ask to
        resend. After verifying, press "I verified — check now".
      </p>
    </div>
  );
}
