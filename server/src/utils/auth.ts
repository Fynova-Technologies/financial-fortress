
export async function getManagementToken(): Promise<string> {
  const response = await fetch(`https://dev-l0cnkmnrn4reomjc.us.auth0.com/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // client_id: "01MHsrRBXd0n3ewDmOLdjjqBpbKdpeNV",
        client_id: "Qp7Jge12QOLRPVmfofHhfTtfqB7wQWVo",
        // client_secret: "mPgCnDzZekXKkNh7ky2REJUWGkMpgRrL62Pc9B-SLvH79jubM71w8DFIhxNBicdl",
        client_secret: "Jp8KZDpX-1w6UidKcytuUmymxySWy1RaY1IMjtoiiFpKipzlwkVmRDGQdcAHeYr5",
        audience: `https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/`,
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
