import { SavingsTracker as SavingsTrackerComponent } from "@/components/calculators/savings-tracker";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { useRef } from "react";
import { savingsGoals } from "server/src/models/schema";
import { toast } from "react-toastify";

export default function SavingsTracker() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { savingsData } = useCalculator();
  const handleSaveData = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted Savings Tracker: ", token);

      const payload = {
        savingsGoals: savingsData.savingsGoals.map(goal => ({
          name: goal.name,
          target_amount: goal.targetAmount, // Ensure this matches your backend schema
          current_amount: goal.currentAmount, // Ensure this matches your backend schema
          target_date: new Date(goal.targetDate), // Convert to Date object if needed
        })),
      };

      const res = await fetch("http://localhost:5000/api/savings-goals", {
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
        throw new Error(errorData.error || "Failed to save Savings Tracker data");
      }
      toast.success("Savings Tracker data saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save Savings Tracker data");
    }
  }

  return (
    <div>
      <PageHeader 
        title="Savings Tracker" 
        description="Track your savings goals"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <SavingsTrackerComponent ref={exportRef}/>
    </div>
  );
}
