import dotenv from 'dotenv';

dotenv.config();

async function triggerAuth0VerificationEmail(userId: string) {
  // const domain = process.env.AUTH0_DOMAIN || "dev-l0cnkmnrn4reomjc.us.auth0.com"; 
  // const clientId = process.env.AUTH0_CLIENT_ID || "Qp7Jge12QOLRPVmfofHhfTtfqB7wQWVo";
  // const clientSecret = process.env.AUTH0_CLIENT_SECRET || "Jp8KZDpX-1w6UidKcytuUmymxySWy1RaY1IMjtoiiFpKipzlwkVmRDGQdcAHeYr5";

  if (!process.env.DOMAIN || !process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
    throw new Error("Auth0 credentials not configured in environment variables");
  }

  // 1. Get Management API token
  const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to get Auth0 management token: ${errorText}`);
  }

  const { access_token } = await tokenResponse.json();

  // 2. Trigger verification email
  const emailResponse = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/verification-email`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    throw new Error(`Failed to send verification email: ${errorText}`);
  }

  return { success: true };
}

// main exported function
export async function sendVerificationEmail(userId: string) {
  if (userId.startsWith("auth0|")) {
    // Only database users can get verification emails
    return triggerAuth0VerificationEmail(userId);
  } else {
    console.log("Skipping verification email for social login:", userId);
    return { success: false, reason: "social-login" };
  }
}

