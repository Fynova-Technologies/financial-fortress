// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
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

// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={Home} />
//       <Route path="/verify" component={VerifyPage} />
//       <ProtectedRoute path="/budget-planner" component={BudgetPlanner} />
//       <ProtectedRoute path="/mortgage-calculator" component={MortgageCalculator} />
//       <ProtectedRoute path="/emi-calculator" component={EMICalculator} />
//       <ProtectedRoute path="/retirement-planner" component={RetirementPlanner} />
//       <ProtectedRoute path="/roi-calculator" component={ROICalculator} />
//       <ProtectedRoute path="/currency-converter" component={CurrencyConverter} />
//       <ProtectedRoute path="/savings-tracker" component={SavingsTracker} />
//       <ProtectedRoute path="/salary-manager" component={SalaryManager} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
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


import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/verify" component={VerifyPage} />
      {/* <ProtectedRoute path="/budget-planner" component={BudgetPlanner} />
      <ProtectedRoute path="/mortgage-calculator" component={MortgageCalculator} />
      <ProtectedRoute path="/emi-calculator" component={EMICalculator} />
      <ProtectedRoute path="/retirement-planner" component={RetirementPlanner} />
      <ProtectedRoute path="/roi-calculator" component={ROICalculator} />
      <ProtectedRoute path="/currency-converter" component={CurrencyConverter} />
      <ProtectedRoute path="/savings-tracker" component={SavingsTracker} />
      <ProtectedRoute path="/salary-manager" component={SalaryManager} /> */}
      <Route path="/budget-planner" component={BudgetPlanner} />
      <Route path="/mortgage-calculator" component={MortgageCalculator} />
      <Route path="/emi-calculator" component={EMICalculator} />
      <Route path="/retirement-planner" component={RetirementPlanner} />
      <Route path="/roi-calculator" component={ROICalculator} />
      <Route path="/currency-converter" component={CurrencyConverter} />
      <Route path="/savings-tracker" component={SavingsTracker} />
      <Route path="/salary-manager" component={SalaryManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    // Check if user just signed up (new user without verified email)
    if (isAuthenticated && user && !user.email_verified) {
      // Check if this is a fresh signup (you can customize this logic)
      const isNewUser = !localStorage.getItem(`user_seen_${user.sub}`);
      if (isNewUser) {
        setJustSignedUp(true);
        setShowVerificationModal(true);
        localStorage.setItem(`user_seen_${user.sub}`, 'true');
      }
    } else if (isAuthenticated && user && user.email_verified) {
      // User is verified, hide modal and allow app access
      setShowVerificationModal(false);
      setJustSignedUp(false);
    }
  }, [isAuthenticated, user]);

  // Show loading spinner while Auth0 is initializing
  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </QueryClientProvider>
    );
  }

  // If user needs to verify email, show only the verification modal
  if (showVerificationModal) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center">
          <VerifyModel
            // open={showVerificationModal}
            // onOpenChange={setShowVerificationModal}
          />
        </div>
      </QueryClientProvider>
    );
  }

  // Normal app flow
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout>
          <Router />
        </MainLayout>
        <AuthPopupManager />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
