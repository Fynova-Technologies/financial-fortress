import { BudgetPlanner as BudgetPlannerComponent } from "@/components/calculators/budget-planner";
import { PageHeader } from "@/components/page-header";
import { useRef, useState } from "react";
import { useBudgetCalculator } from "@/store";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthPopup } from "@/components/auth/AuthPopup";

export default function BudgetPlanner() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { isLoading, isAuthenticated } = useAuth0();
  const { saveBudgetToServer, isSaving } = useBudgetCalculator();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  const handleSaveData = async () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }

    try {
      await saveBudgetToServer();
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
        isSaving={isSaving}
      />
      <BudgetPlannerComponent ref={exportRef} />
      
      {showAuthPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="pointer-events-auto max-w-lg w-full px-4">
            <AuthPopup
              visible={showAuthPopup}
              onClose={() => setShowAuthPopup(false)}
              onLogin={() => {}}
              onSignup={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
