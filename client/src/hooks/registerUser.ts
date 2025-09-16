import { useAuth0 } from "@auth0/auth0-react";

export const useRegisterUser = () => {
  const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
  const API_URL = import.meta.env.VITE_API_URL;

  const registerUser = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }
    if (!isAuthenticated || !user) {
      console.warn("User not authenticated—cannot register.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: user.nickname || user.name || user.email?.split("@")[0],
          email: user.email,
        })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Register API error:", err);
      } else {
        const data = await res.json();
        console.log("Registered user response:", data);
      }
    } catch (err) {
      console.error("Error registering user:", err);
    }
  };

  return { registerUser };
};
