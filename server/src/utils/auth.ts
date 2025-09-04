import dotenv from 'dotenv';

dotenv.config();

export async function getManagementToken(): Promise<string> {

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_M2M_CLIENT_ID,
        client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      }),
    }
  );
   
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to get management token: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.access_token;
}
