
import { BudgetPlanner as BudgetPlannerComponent } from "@/components/calculators/budget-planner";
import { PageHeader } from "@/components/page-header";
import { useRef, useState } from "react";
import { useCalculator } from "@/store/Calculator/index";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthPopup } from "@/components/auth/AuthPopup";
import toast from "react-hot-toast";

export default function BudgetPlanner() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const { budgetData } = useCalculator();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  const handleSaveData = async () => {
    if(!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted: ", token);

      const payload = {
        name: "My Budget",
        total_income: budgetData.totalIncome,
        expenseCategories: budgetData.expenseCategories,
        expenses: budgetData.expenses
      };

      const res = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response error:", errorData);
        throw new Error(errorData.error || "Failed to save budget");
      }
      toast.success("Budget saved successfully.");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save budget");
    }
  };
  
  return (
    <div>
      <PageHeader 
        title="Budget Planner" 
        description="Track your income and expenses"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <BudgetPlannerComponent ref={exportRef}/>

      {showAuthPopup && (
        <AuthPopup
          visible={showAuthPopup}
          onClose={() => setShowAuthPopup(false)}
          // These props are now handled inside AuthPopup with Auth0
          onLogin={() => {}}
          onSignup={() => {}}
        />
      )}
    </div>
  );
}
