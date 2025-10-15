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
import Reports from "./components/Reports";
import Scenarios from "./components/ScenarioPlanning";
import Alerts from "./components/Alerts";
import Calculators from "@/pages/Calculators";
import PhilosophyQuizPage from "./pages/philosophyQuiz";
import OnboardingFlow from "./pages/onboarding";
import DevResetButton from "./lib/DevResetButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={OnboardingFlow} />
      <Route path="/philosophy-quiz" component={PhilosophyQuizPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/Advisory" component={Advisory} />
      <Route path="/reports" component={Reports} />
      <Route path="/scenarios" component={Scenarios} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/Calculators" component={Calculators} />
      <Route path="/budget-planner" component={BudgetPlanner} />
      <ProtectedRoute
        path="/mortgage-calculator"
        component={MortgageCalculator}
      />
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
  const [location, setLocation] = useLocation();

  // Development helper to reset onboarding for current user
  function resetOnboardingForUser(userId: string | undefined) {
    if (!userId) {
      console.error('❌ Cannot reset onboarding: userId is undefined');
      return;
    }
    
    const keys = [
      `financialDataCompleted_${userId}`,
      `philosophyQuizCompleted_${userId}`,
      `financialData_${userId}`,
      `philosophyQuizResult_${userId}`,
      `user_first_seen_${userId}`,
      `pendingOnboarding_${userId}`,
      `hasVisitedHome_${userId}`,
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🔄 Onboarding reset for user:', userId);
  }

  // Expose to window for easy testing (only in development)
  if (process.env.NODE_ENV === 'development') {
    (window as any).resetOnboarding = (userId?: string) => {
      if (userId) {
        resetOnboardingForUser(userId);
      } else if (user?.sub) {
        resetOnboardingForUser(user.sub);
        console.log('✅ Onboarding reset for current user');
        window.location.href = '/';
      } else {
        console.log('Usage: resetOnboarding() or resetOnboarding("user-id")');
      }
    };
  }

  // Check for new users and set flags
  useEffect(() => {
    const checkForNewUser = () => {
      if (!isAuthenticated || !user) return;

      console.log("🔍 Checking if user is new...");

      const financialDataKey = `financialDataCompleted_${user.sub}`;
      const quizKey = `philosophyQuizCompleted_${user.sub}`;
      const userFirstSeen = localStorage.getItem(`user_first_seen_${user.sub}`);

      const hasFinancialData = localStorage.getItem(financialDataKey) === "true";
      const hasCompletedQuiz = localStorage.getItem(quizKey) === "true";

      console.log("  - Has financial data:", hasFinancialData);
      console.log("  - Has completed quiz:", hasCompletedQuiz);
      console.log("  - User first seen timestamp:", userFirstSeen);

      // If this is the first time we're seeing this user
      if (!userFirstSeen) {
        console.log("✅ NEW USER DETECTED - First time seeing this user");

        // Mark when we first saw them
        localStorage.setItem(`user_first_seen_${user.sub}`, Date.now().toString());

        // CRITICAL: For new users, explicitly clear any existing flags
        localStorage.removeItem(financialDataKey);
        localStorage.removeItem(quizKey);
        
        // Set the pending onboarding flag
        console.log("✅ Setting onboarding flag for new user");
        localStorage.setItem(`pendingOnboarding_${user.sub}`, "true");

        // Dispatch event
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("onboardingFlagSet", {
              detail: { userId: user.sub },
            })
          );
        }, 100);
      } else {
        // Existing user - check if they need to complete onboarding
        if (!hasFinancialData || !hasCompletedQuiz) {
          console.log("✅ Existing user needs to complete onboarding");
          localStorage.setItem(`pendingOnboarding_${user.sub}`, "true");

          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("onboardingFlagSet", {
                detail: { userId: user.sub },
              })
            );
          }, 100);
        } else {
          console.log("ℹ️ User has completed full onboarding");
        }
      }
    };

    checkForNewUser();
  }, [isAuthenticated, user]);

  // Handle onboarding flow routing
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      // If not authenticated, don't redirect
      // Home page will show login/signup options via AuthPopupManager
      return;
    }

    const handleOnboardingRedirect = () => {
      try {
        const financialDataKey = `financialDataCompleted_${user.sub}`;
        const quizKey = `philosophyQuizCompleted_${user.sub}`;
        const hasVisitedHomeKey = `hasVisitedHome_${user.sub}`;

        const hasFinancialData = localStorage.getItem(financialDataKey) === "true";
        const hasCompletedQuiz = localStorage.getItem(quizKey) === "true";
        const hasVisitedHome = localStorage.getItem(hasVisitedHomeKey) === "true";
        const pendingOnboarding = localStorage.getItem(`pendingOnboarding_${user.sub}`);

        // Prevent redirect loops
        const protectedPaths = ["/onboarding", "/philosophy-quiz", "/"];
        if (protectedPaths.includes(location)) {
          console.log(`Already on ${location}, skipping redirect`);
          return;
        }

        console.log("🎯 Onboarding Status Check:");
        console.log("  - Has visited home:", hasVisitedHome);
        console.log("  - Has financial data:", hasFinancialData);
        console.log("  - Has completed quiz:", hasCompletedQuiz);
        console.log("  - Pending onboarding:", pendingOnboarding);
        console.log("  - Current location:", location);

        // Step 1: New user should see home first
        if (pendingOnboarding === "true" && !hasVisitedHome) {
          console.log("✅ New user - redirecting to home page");
          setLocation("/");
          return;
        }

        // Step 2: After home, go to financial data collection
        if (pendingOnboarding === "true" && hasVisitedHome && !hasFinancialData) {
          console.log("✅ Visited home - redirecting to financial data collection");
          localStorage.removeItem(`pendingOnboarding_${user.sub}`);
          setLocation("/onboarding");
          return;
        }

        // Step 3: After financial data, go to philosophy quiz
        if (hasFinancialData && !hasCompletedQuiz) {
          console.log("✅ Financial data complete - redirecting to philosophy quiz");
          setLocation("/philosophy-quiz");
          return;
        }

        // Step 4: Everything complete, allow normal navigation
        if (hasFinancialData && hasCompletedQuiz) {
          console.log("✅ Onboarding complete - user can navigate freely");
          return;
        }

        console.log("ℹ️ No redirect needed");
      } catch (err) {
        console.error("Error in onboarding redirect logic:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      handleOnboardingRedirect();
    }, 100);

    const handleFlagSet = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      if (customEvent.detail.userId === user.sub) {
        console.log("🎉 Onboarding flag set, triggering redirect check");
        clearTimeout(timeoutId);
        handleOnboardingRedirect();
      }
    };

    window.addEventListener("onboardingFlagSet", handleFlagSet);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("onboardingFlagSet", handleFlagSet);
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
        {location === "/philosophy-quiz" || location === "/onboarding" || location === "/" ? (
          <Router />
        ) : (
          <MainLayout>
            <Router />
          </MainLayout>
        )}
        {/* Show AuthPopup only for unauthenticated users */}
        {!isAuthenticated && <AuthPopupManager />}
        <DevResetButton /> 
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;