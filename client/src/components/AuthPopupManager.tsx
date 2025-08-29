import React, { useState, useEffect } from "react";
import { AuthPopup } from "@/components/auth/AuthPopup"; 
import { useAuth0 } from "@auth0/auth0-react";

interface User {
  email: string;
}

function AuthPopupManager() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    loginWithRedirect, 
    logout 
  } = useAuth0();
  
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Manage popup visibility
  useEffect(() => {
    // Don't show popup if user is authenticated or still loading
    if (isAuthenticated || isLoading) {
      setShowPopup(false);
      return;
    }

    // Check if popup was dismissed
    const dismissed = localStorage.getItem("authPopupDismissed");
    const dismissedTime = localStorage.getItem("authPopupDismissedTime");
    
    if (dismissed === "true" && dismissedTime) {
      // Show popup again after 24 hours
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime) < dayInMs) {
        console.log("Auth popup dismissed recently, not showing again");
        return;
      } else {
        // Reset dismissal after 24 hours
        localStorage.removeItem("authPopupDismissed");
        localStorage.removeItem("authPopupDismissedTime");
        console.log("Popup dismissal expired, will show again");
      }
    }

    // Show popup after delay
    console.log("Starting popup timer");
    const timer = setTimeout(() => {
      console.log("Showing auth popup");
      setShowPopup(true);
    }, 5000); // 5 seconds for demo (change to 30000 for 30 seconds)

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  // Handle popup close
  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("authPopupDismissed", "true");
    localStorage.setItem("authPopupDismissedTime", Date.now().toString());
    console.log("Popup dismissed");
  };

  // Handle login
  const handleLogin = () => {
    setShowPopup(false);
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login"
      }
    });
  };

  // Handle signup
  const handleSignup = () => {
    setShowPopup(false);
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup"
      }
    });
  };

  return (

      <AuthPopup
        visible={showPopup}
        onClose={handleClose}
        onLogin={handleLogin}
        onSignup={handleSignup}
        isLoading={isLoading}
      />

  );
  
}

export default AuthPopupManager;