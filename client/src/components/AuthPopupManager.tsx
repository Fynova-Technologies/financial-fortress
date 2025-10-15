// import React, { useState, useEffect } from "react";
// import { AuthPopup } from "@/components/auth/AuthPopup"; 
// import { useAuth0 } from "@auth0/auth0-react";

// function AuthPopupManager() {
//   const { 
//     isAuthenticated, 
//     isLoading,
//     user,
//     loginWithRedirect,
//   } = useAuth0();
  
//   const [showPopup, setShowPopup] = useState<boolean>(false);

//   // Simple cleanup - no complex flag transfer needed
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       console.log('✅ User authenticated:', user.sub);
//     }
//   }, [isAuthenticated, user]);

//   // Manage popup visibility
//   useEffect(() => {
//     if (isAuthenticated || isLoading) {
//       setShowPopup(false);
//       return;
//     }

//     const dismissed = localStorage.getItem("authPopupDismissed");
//     const dismissedTime = localStorage.getItem("authPopupDismissedTime");
    
//     if (dismissed === "true" && dismissedTime) {
//       const dayInMs = 24 * 60 * 60 * 1000;
//       if (Date.now() - parseInt(dismissedTime) < dayInMs) {
//         return;
//       } else {
//         localStorage.removeItem("authPopupDismissed");
//         localStorage.removeItem("authPopupDismissedTime");
//       }
//     }

//     const timer = setTimeout(() => {
//       setShowPopup(true);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [isAuthenticated, isLoading]);

//   const handleClose = () => {
//     setShowPopup(false);
//     localStorage.setItem("authPopupDismissed", "true");
//     localStorage.setItem("authPopupDismissedTime", Date.now().toString());
//   };

//   const handleLogin = () => {
//     console.log('🔐 Login initiated');
//     setShowPopup(false);
//     loginWithRedirect({
//       authorizationParams: {
//         screen_hint: "login"
//       }
//     });
//   };

//   const handleSignup = () => {
//     console.log('🆕 Signup initiated');
//     setShowPopup(false);
    
//     // Use Auth0's appState to persist the quiz flag through OAuth redirect
//     loginWithRedirect({
//       authorizationParams: {
//         screen_hint: "signup"
//       },
//       appState: {
//         returnTo: window.location.pathname,
//         needsPhilosophyQuiz: true  // This persists through Auth0 redirect!
//       }
//     });
//   };

//   return (
//     <AuthPopup
//       visible={showPopup}
//       onClose={handleClose}
//       onLogin={handleLogin}
//       onSignup={handleSignup}
//       isLoading={isLoading}
//     />
//   );
// }

// export default AuthPopupManager;







import React, { useState, useEffect } from "react";
import { AuthPopup } from "@/components/auth/AuthPopup"; 
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";

function AuthPopupManager() {
  const { 
    isAuthenticated, 
    isLoading,
    user,
    loginWithRedirect,
  } = useAuth0();
  
  const [, navigate] = useLocation();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Handle authenticated user routing
  useEffect(() => {
    if (!isAuthenticated || !user || isLoading) return;

    console.log('✅ User authenticated:', user.sub);

    const userId = user.sub;
    const hasFinancialData = localStorage.getItem(`financialDataCompleted_${userId}`) === 'true';
    const hasCompletedQuiz = localStorage.getItem(`philosophyQuizCompleted_${userId}`) === 'true';

    // If user has completed onboarding, go to dashboard
    if (hasFinancialData && hasCompletedQuiz) {
      console.log('✅ User has completed onboarding - allowing dashboard access');
      // Don't force navigate here - let user navigate naturally or let App.tsx handle it
      return;
    }

    // New user or incomplete onboarding - App.tsx will handle the redirect
    console.log('ℹ️ User needs to complete onboarding');
    
  }, [isAuthenticated, user, isLoading, navigate]);

  // Manage popup visibility for unauthenticated users
  useEffect(() => {
    // Don't show popup if user is authenticated or auth is loading
    if (isAuthenticated || isLoading) {
      setShowPopup(false);
      return;
    }

    // Check if popup was dismissed recently
    const dismissed = localStorage.getItem("authPopupDismissed");
    const dismissedTime = localStorage.getItem("authPopupDismissedTime");
    
    if (dismissed === "true" && dismissedTime) {
      const dayInMs = 24 * 60 * 60 * 1000; // 24 hours
      const timeSinceDismissal = Date.now() - parseInt(dismissedTime);
      
      if (timeSinceDismissal < dayInMs) {
        // Still within 24 hours, don't show popup
        return;
      } else {
        // More than 24 hours, clear the flags
        localStorage.removeItem("authPopupDismissed");
        localStorage.removeItem("authPopupDismissedTime");
      }
    }

    // Show popup after 5 seconds delay
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

  const handleLogin = async () => {
    console.log('🔐 Login initiated from popup');
    setShowPopup(false);
    
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "login"
        },
        appState: {
          returnTo: window.location.pathname,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async () => {
    console.log('🆕 Signup initiated from popup');
    setShowPopup(false);
    
    try {
      // For new signups, redirect to Auth0 signup page
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup"
        },
        appState: {
          returnTo: "/", // Return to home page after signup
          isNewSignup: true, // Flag to indicate this is a new signup
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
    }
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