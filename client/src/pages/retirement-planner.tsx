import { RetirementPlanner as RetirementPlannerComponent } from "@/components/calculators/retirement-planner";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/Calculator/index";
import { toast } from "react-toastify";
import { useState } from "react";
import AuthPopup from "@/components/auth/AuthPopup";

export default function RetirementPlanner() {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const { retirementData } = useCalculator();
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
      const token = await getAccessTokenSilently();
      console.log("access token granted Retirement Planner: ", token);

      const payload = {
        currentAge: retirementData.currentAge,
        retirementAge: retirementData.retirementAge,
        lifeExpectancy: retirementData.lifeExpectancy,
        currentSavings: retirementData.currentSavings,
        monthlyContribution: retirementData.monthlyContribution,
        expectedReturn: retirementData.expectedReturn,
        inflationRate: retirementData.inflationRate,
        desiredMonthlyIncome: retirementData.desiredMonthlyIncome,
      };

      const res = await fetch(
        "https://financial-fortress.onrender.com/api/retirement-calculations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response error:", errorData);
        throw new Error(
          errorData.error || "Failed to save Retirement Planner data"
        );
      }
      toast.success("Retirement Planner data saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save Retirement Planner data");
    }
  };

  return (
    <div>
      <PageHeader
        title="Retirement Planner"
        description="Plan for your retirement"
        onSave={handleSaveData}
      />
      <RetirementPlannerComponent />

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
