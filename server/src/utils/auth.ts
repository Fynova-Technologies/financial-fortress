// import dotenv from "dotenv";
// dotenv.config();

export async function getManagementToken(): Promise<string> {
  
  // if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
  //   throw new Error(
  //     "Missing AUTH0_M2M_CLIENT_ID or AUTH0_M2M_CLIENT_SECRET in environment variables"
  //   );
  // }

  const response = await fetch(`https://dev-l0cnkmnrn4reomjc.us.auth0.com/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // client_id: process.env.VITE_AUTH0_M2M_CLIENT_ID || "Qp7Jge12QOLRPVmfofHhfTtfqB7wQWVo",
        client_id: "Qp7Jge12QOLRPVmfofHhfTtfqB7wQWVo",
        // client_secret: process.env.VITE_AUTH0_M2M_CLIENT_SECRET |Jp8KZDpX-1w6UidKcytuUmymxySWy1RaY1IMjtoiiFpKipzlwkVmRDGQdcAHeYr5| "Jp8KZDpX-1w6UidKcytuUmymxySWy1RaY1IMjtoiiFpKipzlwkVmRDGQdcAHeYr5",
        client_secret: "Jp8KZDpX-1w6UidKcytuUmymxySWy1RaY1IMjtoiiFpKipzlwkVmRDGQdcAHeYr5",
        // audience: process.env.VITE_AUTH0_AUDIENCE || "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
        audience: "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
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
