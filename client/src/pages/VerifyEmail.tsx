import React, { useEffect, useState, useRef } from "react";
import VerifyModal from "@/components/VerifyEmailModel";
import { toast } from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

export default function VerifyPage() {
  const { loginWithRedirect, user } = useAuth0();
  const [status, setStatus] = useState("checking"); // "checking" | "verified" | "not-verified" | "error" | "no-userid"
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const attemptsRef = useRef(0);
  const pollTimeoutRef = useRef<number | null>(null);

 console.log("VerifyPage user:", user);
 console.log("VerifyPage status:", status);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("verified") === "true") {
    toast.success("Email verified successfully!");
    setStatus(() => "verified");
    return;
  }

  const userId = urlParams.get("user_id");
  if (!userId) {
    setStatus(() => "no-userid");
    return;
  }

  let cancelled = false;
  attemptsRef.current = 0;

  const checkOnce = async () => {
    if (cancelled) return;

    attemptsRef.current++;
    try {
      const resp = await fetch(
        `http://localhost:5000/api/check-email-verified-public?user_id=${encodeURIComponent(userId)}`
      );

      if (!resp.ok) {
        throw new Error(await resp.text() || `Status ${resp.status}`);
      }

      const body = await resp.json();

      if (body.email_verified) {
        if (!cancelled) {
          toast.success("Email verified! You can now log in.");
          setStatus(() => "verified");
        }
      } else {
        if (attemptsRef.current >= 20) {
          if (!cancelled) setStatus(() => "not-verified");
        } else {
          if (!cancelled) {
            setStatus(() => "checking");
            pollTimeoutRef.current = window.setTimeout(checkOnce, 3000);
          }
        }
      }
    } catch (err) {
      if (!cancelled) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(msg);
        setStatus(() => "error");
      }
    }
  };

  checkOnce();

  return () => {
    cancelled = true;
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
  };
}, []);


  const handleLogin = async () => {
    // prefer Auth0 SDK; fallback to redirecting to your app's login route
    try {
      await loginWithRedirect();
    } catch (err) {
      console.warn("loginWithRedirect failed, falling back to /login", err);
      window.location.href = "/login";
    }
  };

  // UI:
  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
        <VerifyModal />
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Thank you for signing up!</h2>
          <p className="mb-6">Your email has been verified. Click below to log in and continue.</p>
          <button
            onClick={handleLogin}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  if (status === "not-verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Still not verified</h2>
          <p className="mb-4">
            We couldn't confirm your email verification yet. Please wait a moment and try again, or sign in manually.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Check again</button>
            <button onClick={handleLogin} className="px-4 py-2 rounded bg-indigo-600 text-white">Sign in</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "no-userid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Email verification</h2>
          <p className="mb-4">
            We couldn't find the verification information in the URL. Please sign in and we'll detect your verified status.
          </p>
          <button onClick={handleLogin} className="px-6 py-2 rounded-lg bg-indigo-600 text-white">Sign in</button>
        </div>
      </div>
    );
  }

  // error
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Error checking verification</h2>
        <p className="mb-4">There was an error checking verification status: {errorMsg}</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Try again</button>
          <button onClick={handleLogin} className="px-4 py-2 rounded bg-indigo-600 text-white">Sign in</button>
        </div>
      </div>
    </div>
  );
}
