import SavingsTrackerComponent from "@/components/calculators/savings-tracker";
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

    if (isLoading) return;

    try {
      const token = await getAccessTokenSilently();

      // Separate new and existing goals
      const newGoals = savingsData.savingsGoals.filter((g) => !g.id);
      const existingGoals = savingsData.savingsGoals.filter((g) => g.id);

      // If no new goals and no changes to existing goals, show toast
      if (newGoals.length === 0) {
        toast.info("No new goals to save.");
        return; // stop saving
      }

      // Update existing goals
      for (const goal of existingGoals) {
        const res = await fetch(
          `https://financial-fortress.onrender.com/api/savings-goals/${goal.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: goal.name,
              target_amount: goal.targetAmount,
              current_amount: goal.currentAmount,
              target_date: goal.targetDate,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Update error:", errorData);
        }
      }

      // Create new goals
      if (newGoals.length > 0) {
        const payload = {
          savingsGoals: newGoals.map((goal) => ({
            name: goal.name,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            target_date: goal.targetDate,
          })),
        };

        const res = await fetch(
          "https://financial-fortress.onrender.com/api/savings-goals",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Create error:", errorData);
        }
      }

      toast.success("Savings goals saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
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
