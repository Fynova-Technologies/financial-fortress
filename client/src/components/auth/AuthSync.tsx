import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRegisterUser } from "@/hooks/registerUser";

export function AuthSync() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { registerUser } = useRegisterUser();

  useEffect(() => {
    if(!isLoading && isAuthenticated) {
        registerUser()
          .then(() => { 
            console.log("User registered successfully");
          })
          .catch((error) => {   
            console.error("Error registering user:", error);
          });   
    }
  }, [isAuthenticated, registerUser]);

  return null; // This component does not render anything
}