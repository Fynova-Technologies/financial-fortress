
import { useEffect, useState } from "react";

export default function EmailVerified() {
  const [status, setStatus] = useState({ success: null, message: "" });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const success = p.get("success") === "true";
    const message = p.get("message") || (success ? "Email verified." : "Verification failed.");
    setStatus({ success, message });
  }, []);

  if (status.success === null) return <div>Checking…</div>;
  return (
    <div>
      {status.success ? <h2> Email verified</h2> : <h2> Verification failed</h2>}
      <p>{status.message}</p>
      {/* Optionally redirect to login or auto-login */}
    </div>
  );
}
