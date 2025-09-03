import { SavingsTracker as SavingsTrackerComponent } from "@/components/calculators/savings-tracker";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/Calculator/index";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthPopup from "@/components/auth/AuthPopup";

export default function SavingsTracker() {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const { savingsData } = useCalculator();
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
      console.log("access token granted Savings Tracker: ", token);

      const payload = {
        savingsGoals: savingsData.savingsGoals.map((goal) => ({
          name: goal.name,
          target_amount: goal.targetAmount, // Ensure this matches your backend schema
          current_amount: goal.currentAmount, // Ensure this matches your backend schema
          target_date: new Date(goal.targetDate), // Convert to Date object if needed
        })),
      };

      const res = await fetch("http://financial-fortress.onrender.com/api/savings-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response error:", errorData);
        throw new Error(
          errorData.error || "Failed to save Savings Tracker data"
        );
      }
      toast.success("Savings Tracker data saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save Savings Tracker data");
    }
  };

  return (
    <div>
      <PageHeader
        title="Goal Tracker"
        description="Track your savings and goals"
        onSave={handleSaveData}
      />
      <SavingsTrackerComponent />

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
