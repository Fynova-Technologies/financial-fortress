// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect, useState } from "react";
// import NotFound from "@/pages/not-found";
// import MainLayout from "@/layouts/main-layout";
// import Home from "@/pages/home";
// import BudgetPlanner from "@/pages/budget-planner";
// import MortgageCalculator from "@/pages/mortgage-calculator";
// import EMICalculator from "@/pages/emi-calculator";
// import RetirementPlanner from "@/pages/retirement-planner";
// import ROICalculator from "@/pages/roi-calculator";
// import CurrencyConverter from "@/pages/currency-converter";
// import SavingsTracker from "@/pages/savings-tracker";
// import SalaryManager from "@/pages/salary-manager";
// import AuthPopupManager from "@/components/AuthPopupManager";
// import ProtectedRoute from "./components/ProtectedRoute";
// import VerifyPage from "@/pages/VerifyEmail";
// import VerifyModel from "@/components/VerifyEmailModel";
// import AboutUsPage from "@/pages/AboutUsPage";
// import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
// import { TermsConditionsPage } from "./pages/TermsConditionsPage";
// import ContactUsPage from "./pages/ContactUsPage";


// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={Home} />
//       <Route path="/verify" component={VerifyPage} />
//       <Route path="/budget-planner" component={BudgetPlanner} />
//       {/* <Route path="/mortgage-calculator" component={MortgageCalculator} /> */}
//       <ProtectedRoute path="/mortgage-calculator" component={MortgageCalculator} />
//       <Route path="/emi-calculator" component={EMICalculator} />
//       <Route path="/retirement-planner" component={RetirementPlanner} />
//       {/* <Route path="/roi-calculator" component={ROICalculator} /> */}
//       <ProtectedRoute path="/roi-calculator" component={ROICalculator} />
//       <Route path="/currency-converter" component={CurrencyConverter} />
//       <Route path="/savings-tracker" component={SavingsTracker} />
//       <Route path="/salary-manager" component={SalaryManager} />
//       <Route path="/about-us" component={AboutUsPage} />
//       <Route path="/privacy-policy" component={PrivacyPolicyPage} />
//       <Route path="/terms-conditions" component={TermsConditionsPage} />
//       <Route path="/contact-us" component={ContactUsPage} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [justSignedUp, setJustSignedUp] = useState(false);

//   useEffect(() => {
//     // Check if user just signed up (new user without verified email)
//     if (isAuthenticated && user && !user.email_verified) {
//       // Always show verification modal for unverified users
//       const isNewUser = !localStorage.getItem(`user_seen_${user.sub}`);
//       setJustSignedUp(isNewUser);
//       setShowVerificationModal(true);

//       if (isNewUser) {
//         localStorage.setItem(`user_seen_${user.sub}`, "true");
//       }
//     } else if (isAuthenticated && user && user.email_verified) {
//       // User is verified, hide modal and allow app access
//       setShowVerificationModal(false);
//       setJustSignedUp(false);
//     }
//   }, [isAuthenticated, user]);

//   // Show loading spinner while Auth0 is initializing
//   if (isLoading) {
//     return (
//       <QueryClientProvider client={queryClient}>
//         <div className="fixed inset-0 flex items-center justify-center bg-white">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </QueryClientProvider>
//     );
//   }

//   // If user needs to verify email, show only the verification modal
//   if (showVerificationModal) {
//     return (
//       <QueryClientProvider client={queryClient}>
//         <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center">
//           <VerifyModel />
//         </div>
//       </QueryClientProvider>
//     );
//   }

//   // Normal app flow
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <MainLayout>
//           <Router />
//         </MainLayout>
//         <AuthPopupManager />
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;




import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth0 } from "@auth0/auth0-react";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/main-layout";
import Home from "@/pages/home";
import BudgetPlanner from "@/pages/budget-planner";
import MortgageCalculator from "@/pages/mortgage-calculator";
import EMICalculator from "@/pages/emi-calculator";
import RetirementPlanner from "@/pages/retirement-planner";
import ROICalculator from "@/pages/roi-calculator";
import CurrencyConverter from "@/pages/currency-converter";
import SavingsTracker from "@/pages/savings-tracker";
import SalaryManager from "@/pages/salary-manager";
import AuthPopupManager from "@/components/AuthPopupManager";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyPage from "@/pages/VerifyEmail";
import VerifyModel from "@/components/VerifyEmailModel";
import AboutUsPage from "@/pages/AboutUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { TermsConditionsPage } from "./pages/TermsConditionsPage";
import ContactUsPage from "./pages/ContactUsPage";
import Dashboard from "./pages/dashboard";
import Advisory from "./pages/Advisory";
import Calculators from "@/pages/Calculators";
import PhilosophyQuizPage from "./pages/philosophyQuiz";
import FinancialDataCollection from "./components/FinancialDataCollection";

function Router() {
  return (
    <Switch>
      <Route path="/philosophy-quiz" component={PhilosophyQuizPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/Advisory" component={Advisory} />
      <Route path="/Calculators" component={Calculators} />
      <Route path="/budget-planner" component={BudgetPlanner} />
      <ProtectedRoute path="/mortgage-calculator" component={MortgageCalculator} />
      <Route path="/emi-calculator" component={EMICalculator} />
      <Route path="/retirement-planner" component={RetirementPlanner} />
      <ProtectedRoute path="/roi-calculator" component={ROICalculator} />
      <Route path="/currency-converter" component={CurrencyConverter} />
      <Route path="/savings-tracker" component={SavingsTracker} />
      <Route path="/salary-manager" component={SalaryManager} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-conditions" component={TermsConditionsPage} />
      <Route path="/contact-us" component={ContactUsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [location, setLocation] = useLocation();

  // CRITICAL: Capture appState from Auth0 redirect and detect new users
  useEffect(() => {
    const checkForNewUser = () => {
      if (!isAuthenticated || !user) return;
      
      console.log('🔍 Checking if user is new...');
      
      const hasCompletedQuiz = localStorage.getItem(`philosophyQuizCompleted_${user.sub}`);
      const userFirstSeen = localStorage.getItem(`user_first_seen_${user.sub}`);
      
      console.log('  - Has completed quiz:', hasCompletedQuiz);
      console.log('  - User first seen timestamp:', userFirstSeen);
      
      // If this is the first time we're seeing this user
      if (!userFirstSeen) {
        console.log('✅ NEW USER DETECTED - First time seeing this user');
        
        // Mark when we first saw them
        localStorage.setItem(`user_first_seen_${user.sub}`, Date.now().toString());
        
        // Set quiz flag for new users
        if (!hasCompletedQuiz) {
          console.log('✅ Setting quiz flag for new user');
          localStorage.setItem(`pendingPhilosophyQuiz_${user.sub}`, 'true');
          
          // Dispatch event
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('quizFlagTransferred', { 
              detail: { userId: user.sub } 
            }));
          }, 100);
        }
      } else {
        // Check if quiz needs to be completed regardless of when user was first seen
        if (!hasCompletedQuiz) {
          console.log('✅ User has not completed quiz - setting quiz flag');
          localStorage.setItem(`pendingPhilosophyQuiz_${user.sub}`, 'true');
          
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('quizFlagTransferred', { 
              detail: { userId: user.sub } 
            }));
          }, 100);
        } else {
          console.log('ℹ️ User has completed quiz - no redirect needed');
        }
      }
    };
    
    checkForNewUser();
  }, [isAuthenticated, user]);

  // Debug: Log localStorage on mount
  useEffect(() => {
    console.log('🔍 App mounted - localStorage contents:');
    console.log('  - pendingPhilosophyQuiz_temp:', localStorage.getItem('pendingPhilosophyQuiz_temp'));
    console.log('  - sessionStorage backup:', sessionStorage.getItem('pendingPhilosophyQuiz_backup'));
    if (user) {
      console.log(`  - pendingPhilosophyQuiz_${user.sub}:`, localStorage.getItem(`pendingPhilosophyQuiz_${user.sub}`));
      console.log(`  - philosophyQuizCompleted_${user.sub}:`, localStorage.getItem(`philosophyQuizCompleted_${user.sub}`));
    }
  }, [user]);

  // SINGLE UNIFIED useEffect for all auth-related logic
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      setShowVerificationModal(false);
      setJustSignedUp(false);
      return;
    }

    // Email verification modal logic
    if (!user.email_verified) {
      const isNewUser = !localStorage.getItem(`user_seen_${user.sub}`);
      setJustSignedUp(isNewUser);
      setShowVerificationModal(true);

      if (isNewUser) {
        localStorage.setItem(`user_seen_${user.sub}`, "true");
      }
    } else {
      setShowVerificationModal(false);
      setJustSignedUp(false);
    }

    // Philosophy quiz redirect logic
    const handleQuizRedirect = () => {
      try {
        const quizKey = `philosophyQuizCompleted_${user.sub}`;
        const hasCompletedQuiz = !!localStorage.getItem(quizKey);
        const alreadyOnQuiz = location === "/philosophy-quiz";

        if (hasCompletedQuiz || alreadyOnQuiz) {
          console.log('Quiz already completed or user on quiz page');
          return;
        }

        const pendingQuizFlag = localStorage.getItem(`pendingPhilosophyQuiz_${user.sub}`);
        
        if (pendingQuizFlag === 'true') {
          console.log('✅ Found user-specific quiz flag, redirecting to quiz');
          localStorage.removeItem(`pendingPhilosophyQuiz_${user.sub}`);
          setLocation("/philosophy-quiz");
          return;
        }

        console.log('No quiz flag found - user can proceed normally');
      } catch (err) {
        console.error("Error in quiz redirect logic:", err);
      }
    };

    // Small delay to allow AuthPopupManager to transfer flag first
    const timeoutId = setTimeout(() => {
      handleQuizRedirect();
    }, 100);

    // Listen for flag transfer event from AuthPopupManager
    const handleFlagTransferred = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      if (customEvent.detail.userId === user.sub) {
        console.log('🎉 Quiz flag transferred, triggering redirect check');
        clearTimeout(timeoutId);
        handleQuizRedirect();
      }
    };

    window.addEventListener('quizFlagTransferred', handleFlagTransferred);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('quizFlagTransferred', handleFlagTransferred);
    };
  }, [isLoading, isAuthenticated, user, location, setLocation]);

  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </QueryClientProvider>
    );
  }

  if (showVerificationModal) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center">
          <VerifyModel />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* If we are on the philosophy quiz page, do NOT wrap with MainLayout */}
        {location === "/philosophy-quiz" ? (
          <Router />
        ) : (
          <MainLayout>
            <Router />
          </MainLayout>
        )}
        <AuthPopupManager />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;