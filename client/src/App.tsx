import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import VerifyPage from "@/components/VerifyEmailNotic";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/verify" component={VerifyPage} />
      <ProtectedRoute path="/budget-planner" component={BudgetPlanner} />
      <ProtectedRoute path="/mortgage-calculator" component={MortgageCalculator} />
      <ProtectedRoute path="/emi-calculator" component={EMICalculator} />
      <ProtectedRoute path="/retirement-planner" component={RetirementPlanner} />
      <ProtectedRoute path="/roi-calculator" component={ROICalculator} />
      <ProtectedRoute path="/currency-converter" component={CurrencyConverter} />
      <ProtectedRoute path="/savings-tracker" component={SavingsTracker} />
      <ProtectedRoute path="/salary-manager" component={SalaryManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
