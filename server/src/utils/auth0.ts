import { useAuth0 } from "@auth0/auth0-react";

export async function sendVerificationEmail(userId: string) {
    const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
//   const domain = "dev-l0cnkmnrn4reomjc.us.auth0.com"; 

  if (!token ) {
    throw new Error("Auth0 credentials not configured");
  }

  const response = await fetch(`https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/jobs/verification-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send verification email: ${errorText}`);
  }
}
