import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useCalculator } from "@/store/index";
import type { SavingsGoal, SavingsData } from "@/types"; 

const API_BASE = "https://financial-fortress.onrender.com/api"; // change if needed

export function useSavingsTracker() {
  const { getAccessTokenSilently, isLoading, user, isAuthenticated } = useAuth0();
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
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);
  const [savingGoal, setSavingGoal] = useState<boolean>(false);

  // NORMALIZER: convert backend rows -> SavingsData (ids -> string)
  const mapServerGoals = (rows: any[]): SavingsData => ({
    savingsGoals: rows.map((r: any) => ({
      id: String(r.id),
      name: r.name,
      targetAmount: Number(r.target_amount ?? r.targetAmount ?? 0),
      contributionType: (r.contribution_type ?? r.contributionType ?? "monthly") as any,
      currentAmount: Number(r.current_amount ?? r.currentAmount ?? 0),
      targetDate: (r.target_date ?? r.targetDate)?.split?.("T")?.[0] ?? r.target_date,
    })),
    monthlySavings: 0,
  });

  const loadGoals = useCallback(async () => {
    if (isLoading) return;
    if (!user) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/savings-goals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch goals (${res.status}): ${txt}`);
      }

      const rows = await res.json();
      updateSavingsData(mapServerGoals(rows));
    } catch (err: any) {
      console.error("loadGoals error:", err);
      toast.error("Unable to load saving goals");
    } finally {
      setLoading(false);
    }
  }, [isLoading, user, getAccessTokenSilently, updateSavingsData]);

useEffect(() => {
  if (!isLoading && isAuthenticated) {
    loadGoals();
  }
}, [isLoading, isAuthenticated]); 


  useEffect(() => {
    setResults(calculateSavings());
  }, [savingsData, calculateSavings]);

  const handleAddOrUpdate = async (goal: SavingsGoal) => {
    const freshResults = calculateSavings();
    setSavingGoal(true);

    try {
      if (!goal || !goal.name || !goal.targetAmount) {
        toast.error("Missing required fields");
        return;
      }

      const token = await getAccessTokenSilently();

      // EDIT
      if (editingGoal) {
        const numericId = Number(editingGoal.id);
        if (Number.isNaN(numericId)) throw new Error("Invalid id for update");

        const payload: any = {
          name: goal.name,
          target_amount: Number(goal.targetAmount),
          current_amount: Number(goal.currentAmount ?? 0),
          target_date: goal.targetDate,
        };

        const res = await fetch(`${API_BASE}/savings-goals/${numericId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Update failed: ${res.status} ${txt}`);
        }

        const updatedRow = await res.json();
        // update local store with canonical server row
        updateSavingsGoal(String(updatedRow.id), {
          name: updatedRow.name,
          targetAmount: Number(updatedRow.target_amount ?? updatedRow.targetAmount),
          currentAmount: Number(updatedRow.current_amount ?? updatedRow.currentAmount),
          targetDate: (updatedRow.target_date ?? updatedRow.targetDate)?.split?.("T")?.[0],
          contributionType: updatedRow.contribution_type ?? "monthly",
        });

        toast.success("Goal updated");
      } else {
        // ADD
        const payload = {
          savingsGoals: [
            {
              name: goal.name,
              target_amount: Number(goal.targetAmount),
              current_amount: Number(goal.currentAmount ?? 0),
              target_date: goal.targetDate,
            },
          ],
        };

        const res = await fetch(`${API_BASE}/savings-goals`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Create failed: ${res.status} ${txt}`);
        }

        const body = await res.json();
        const created = body.savingsGoals?.[0];
        if (!created) throw new Error("Server did not return created goal");

        // normalize & add to local store
        const normalized: SavingsGoal = {
          id: String(created.id),
          name: created.name,
          targetAmount: Number(created.target_amount ?? created.targetAmount),
          currentAmount: Number(created.current_amount ?? created.currentAmount ?? 0),
          targetDate: (created.target_date ?? created.targetDate)?.split?.("T")?.[0],
          contributionType: (created.contribution_type ?? "monthly") as any,
        };

        addSavingsGoal(normalized);
        toast.success("Goal added");
      }

      // recalc & reload canonical list
      setResults(calculateSavings());
      // await loadGoals(); 
      setResults(freshResults);
      setEditingGoal(null);
      setShowModal(false);
      setContributionAmount(0);
    } catch (err) {
      console.error("handleAddOrUpdate:", err);
      toast.error("Failed to save goal");
    } finally {
      setSavingGoal(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm("Confirm delete?")) return;
    if (isLoading || !user) return;

    setIsDeleting(true);
    try {
      const token = await getAccessTokenSilently();
      const idNum = Number(goalId);
      if (Number.isNaN(idNum)) throw new Error("Invalid id");

      const res = await fetch(`${API_BASE}/savings-goals/${idNum}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }

      // remove locally
      deleteSavingsGoal(String(idNum));
      toast.success("Goal deleted");
    } catch (err) {
      console.error("handleDelete:", err);
      toast.error("Failed to delete goal");
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddModal = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add or edit goals");
      setShowAuthPopup(true);
      return;
    }
    setEditingGoal(null);
    setContributionAmount(savingsData?.moneySavings ?? 0);
    setShowModal(true);
  };

  const openEditModal = (goal: SavingsGoal | null) => {
    if (!isAuthenticated) {
      toast.info("Please log in to add or edit goals");
      setShowAuthPopup(true);
      return;
    }
    if (!goal) {
      setEditingGoal(null);
      setContributionAmount(savingsData?.moneySavings ?? 0);
      setShowModal(true);
      return;
    }
    setEditingGoal(goal);
    setContributionAmount(goal.currentAmount ?? savingsData.moneySavings ?? 0);
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
    handleContribute: async (goal: SavingsGoal, extra: number) => {
      // update current_amount and persist via PUT
      try {
        const token = await getAccessTokenSilently();
        const numericId = Number(goal.id);
        if (Number.isNaN(numericId)) throw new Error("Invalid id for contribute");

        const newCurrent = goal.currentAmount + extra;
        const res = await fetch(`${API_BASE}/savings-goals/${numericId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ current_amount: newCurrent }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Contribute failed: ${res.status} ${txt}`);
        }

        const updated = await res.json();
        updateSavingsGoal(String(updated.id), {
          currentAmount: Number(updated.current_amount ?? newCurrent),
        });
        toast.success("Contribution saved");
      } catch (err) {
        console.error("handleContribute:", err);
        toast.error("Contribution failed");
      }
    },
    reload: loadGoals,

    //auth
    showAuthPopup,
    setShowAuthPopup,
    savingGoal,
  };
}
