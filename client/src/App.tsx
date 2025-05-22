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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout>
          <Router />
        </MainLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
