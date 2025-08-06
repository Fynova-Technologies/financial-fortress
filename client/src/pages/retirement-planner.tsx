import { RetirementPlanner as RetirementPlannerComponent } from "@/components/calculators/retirement-planner";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function RetirementPlanner() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { retirementData } = useCalculator();

  const handleSaveData = async () => {
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
        lifeExpenctancy: retirementData.lifeExpectancy,
        currentSavings: retirementData.currentSavings,
        monthlyContribution: retirementData.monthlyContribution,
        expectedReturn: retirementData.expectedReturn,
        inflationRate: retirementData.inflationRate,
        desiredMonthlyIncome: retirementData.desiredMonthlyIncome,
      };

      const res = await fetch("http://localhost:5000/api/retirement-plans", {
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
        throw new Error(errorData.error || "Failed to save Retirement Planner data");
      }
      toast.success("Retirement Planner data saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save Retirement Planner data");
    }
  }
  return (
    <div>
      <PageHeader 
        title="Retirement Planner" 
        description="Plan for your retirement"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <RetirementPlannerComponent ref={exportRef}/>
    </div>
  );
}
