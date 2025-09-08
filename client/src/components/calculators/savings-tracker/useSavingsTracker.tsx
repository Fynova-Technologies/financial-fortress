import { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useCalculator } from "@/store/Calculator/index";
import { SavingsGoal } from "./types";

/**
 * Hook centralizes: loading goals from API, add/update/delete, contribution,
 * calling calculateSavings() from your store and exposing results to UI.
 */
export function useSavingsTracker() {
  const { getAccessTokenSilently, isLoading, user } = useAuth0();
  const {
    savingsData,
    updateSavingsData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateSavings,
  } = useCalculator();

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [results, setResults] = useState<any>(null);

  const apiBase = "https://financial-fortress.onrender.com";

  const mapServerGoals = (allCalculations: any[]) => ({
    savingsGoals: allCalculations.map((g) => ({
      id: String(g.id),
      name: g.name,
      targetAmount: parseFloat(g.target_amount),
      contributionType: "monthly" as const,
      currentAmount: parseFloat(g.current_amount),
      targetDate: g.target_date.split("T")[0],
    })),
    moneySavings: allCalculations[0]?.monthly_savings || 0,
  });

  const loadGoals = useCallback(async () => {
    if (isLoading) return;
    if (!user) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiBase}/api/savings-goals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch goals");
      const all: any[] = await res.json();
      if (all.length === 0) {
        // keep store as-is
        setLoading(false);
        return;
      }
      // update your store
      updateSavingsData(mapServerGoals(all));
    } catch (err: any) {
      console.error("loadGoals:", err);
      toast.error("Could not load savings goals");
    } finally {
      setLoading(false);
    }
  }, [user, getAccessTokenSilently, isLoading, updateSavingsData]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    // recalc whenever store data changes
    setResults(calculateSavings());
  }, [savingsData, calculateSavings]);

const handleAddOrUpdate = async (goal: SavingsGoal) => {
  const freshResults = calculateSavings();

  try {
    // Basic validation on the hook side (UI should also validate)
    if (!goal || !goal.name || !goal.targetAmount) {
      toast.error("Missing required goal fields");
      return;
    }

    // If editing, call update; otherwise add
    if (editingGoal) {
      console.log("Updating goal:", goal);
      await updateSavingsGoal(editingGoal.id, goal); // assume this updates your store
      toast.success("Goal updated");
    } else {
      console.log("Adding goal:", goal);
      // Try to add to backend/store
      await addSavingsGoal(goal);

      // Defensive: if addSavingsGoal doesn't update store, patch it locally:
      try {
        // If your store uses updateSavingsData to set the full object:
        updateSavingsData({
          savingsGoals: [
            ...(savingsData?.savingsGoals ?? []),
            {
              id: goal.id,
              name: goal.name,
              targetAmount: Number(goal.targetAmount),
              currentAmount: Number(goal.currentAmount ?? 0),
              targetDate: goal.targetDate,
              contributionType: goal.contributionType ?? "monthly",
            },
          ],
          // preserve moneySavings or override with contributionAmount
          moneySavings: contributionAmount ?? savingsData?.moneySavings ?? 0,
        });
      } catch (err) {
        console.warn("Local store patch failed, continuing — will reload from backend", err);
      }

      toast.success("Goal added");
    }

    // Recalculate results
    const newResults = calculateSavings();
    setResults(newResults);

    // Option: reload canonical data from backend if you want absolute source of truth
    await loadGoals(); // uncomment if you want to re-fetch from server
    setResults(freshResults);

    // Close modal & reset editing state
    setEditingGoal(null);
    setShowModal(false);
    setContributionAmount(0);
  } catch (err) {
    console.error("handleAddOrUpdate error:", err);
    toast.error("Failed to save goal. Check console and network.");
  }
};


  const handleDelete = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    if (isLoading || !user) return;

    setIsDeleting(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiBase}/api/savings-goals/${goalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Delete failed");
      }
      deleteSavingsGoal(goalId);
      toast.success("Goal deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete goal");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContribute = async (goal: SavingsGoal, extra: number) => {
    try {
      await updateSavingsGoal(goal.id, {
        ...goal,
        currentAmount: goal.currentAmount + extra,
      });
      toast.success("Contribution saved");
    } catch (err) {
      console.error(err);
      toast.error("Contribution failed");
    }
  };

  const openAddModal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const openEditModal = (goal: SavingsGoal | null) => {
    // If no goal was provided, open modal for adding a new goal
    if (!goal) {
      setEditingGoal(null);
      setContributionAmount(savingsData?.moneySavings ?? 0);
      setShowModal(true);
      return;
    }

    setEditingGoal(goal);
    setContributionAmount(
      goal.userContribution ?? savingsData.moneySavings ?? 0
    );
    setShowModal(true);
  };

  return {
    // data
    savingsData,
    results,
    loading,
    isDeleting,
    showModal,
    editingGoal,
    contributionAmount,
    // actions
    setShowModal,
    setContributionAmount,
    openAddModal,
    openEditModal,
    handleAddOrUpdate,
    handleDelete,
    handleContribute,
    reload: loadGoals,
  };
}
