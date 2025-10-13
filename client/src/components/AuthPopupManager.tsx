import React, { useState, useEffect } from "react";
import { AuthPopup } from "@/components/auth/AuthPopup"; 
import { useAuth0 } from "@auth0/auth0-react";

function AuthPopupManager() {
  const { 
    isAuthenticated, 
    isLoading,
    user,
    loginWithRedirect,
  } = useAuth0();
  
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Simple cleanup - no complex flag transfer needed
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User authenticated:', user.sub);
    }
  }, [isAuthenticated, user]);

  // Manage popup visibility
  useEffect(() => {
    if (isAuthenticated || isLoading) {
      setShowPopup(false);
      return;
    }

    const dismissed = localStorage.getItem("authPopupDismissed");
    const dismissedTime = localStorage.getItem("authPopupDismissedTime");
    
    if (dismissed === "true" && dismissedTime) {
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime) < dayInMs) {
        return;
      } else {
        localStorage.removeItem("authPopupDismissed");
        localStorage.removeItem("authPopupDismissedTime");
      }
    }

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("authPopupDismissed", "true");
    localStorage.setItem("authPopupDismissedTime", Date.now().toString());
  };

  const handleLogin = () => {
    console.log('🔐 Login initiated');
    setShowPopup(false);
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login"
      }
    });
  };

  const handleSignup = () => {
    console.log('🆕 Signup initiated');
    setShowPopup(false);
    
    // Use Auth0's appState to persist the quiz flag through OAuth redirect
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup"
      },
      appState: {
        returnTo: window.location.pathname,
        needsPhilosophyQuiz: true  // This persists through Auth0 redirect!
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