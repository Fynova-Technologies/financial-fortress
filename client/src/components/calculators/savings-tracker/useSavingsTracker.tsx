// import { useEffect, useState, useCallback } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { toast } from "react-toastify";
// import { useCalculator } from "@/store/Calculator/index";
// import { SavingsGoal } from "./types";
// import { SavingsData } from "@/store/Calculator/types";

// /**
//  * Hook centralizes: loading goals from API, add/update/delete, contribution,
//  * calling calculateSavings() from your store and exposing results to UI.
//  */
// export function useSavingsTracker() {
//   const { getAccessTokenSilently, isLoading, user } = useAuth0();
//   const {
//     savingsData,
//     updateSavingsData,
//     addSavingsGoal,
//     updateSavingsGoal,
//     deleteSavingsGoal,
//     calculateSavings,
//   } = useCalculator();

//   const [loading, setLoading] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
//   const [contributionAmount, setContributionAmount] = useState<number>(0);
//   const [results, setResults] = useState<any>(null);

//   const apiBase = "https://financial-fortress.onrender.com";

//   const mapServerGoals = (rows: any[]): SavingsData => ({
//     savingsGoals: rows.map((r: any) => ({
//       id: String(r.id),
//       name: r.name,
//       targetAmount: Number(r.target_amount ?? r.targetAmount ?? 0),
//       contributionType: (r.contribution_type ?? r.contributionType ?? "monthly") as any,
//       currentAmount: Number(r.current_amount ?? r.currentAmount ?? 0),
//       targetDate: (r.target_date ?? r.targetDate)?.split?.("T")?.[0] ?? r.target_date,
//     })),
//     moneySavings: 0,
//   });

//   const loadGoals = useCallback(async () => {
//     if (isLoading) return;
//     if (!user) return;

//     setLoading(true);
//     try {
//       const token = await getAccessTokenSilently();
//       const res = await fetch(`${apiBase}/api/savings-goals`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch goals");
//       const all: any[] = await res.json();
//       if (all.length === 0) {
//         // keep store as-is
//         setLoading(false);
//         return;
//       }
//       // update your store
//       updateSavingsData(mapServerGoals(all));
//     } catch (err: any) {
//       console.error("loadGoals:", err);
//       toast.error("Could not load savings goals");
//     } finally {
//       setLoading(false);
//     }
//   }, [user, getAccessTokenSilently, isLoading, updateSavingsData]);

//   useEffect(() => {
//     loadGoals();
//   }, [loadGoals]);

//   useEffect(() => {
//     // recalc whenever store data changes
//     setResults(calculateSavings());
//   }, [savingsData, calculateSavings]);

// const handleAddOrUpdate = async (goal: SavingsGoal) => {
//   const freshResults = calculateSavings();

//   try {
//     // Basic validation on the hook side (UI should also validate)
//     if (!goal || !goal.name || !goal.targetAmount) {
//       toast.error("Missing required goal fields");
//       return;
//     }

//     // If editing, call update; otherwise add
//     if (editingGoal) {
//       console.log("Updating goal:", goal);
//       updateSavingsGoal(editingGoal.id, goal); // assume this updates your store
//       toast.success("Goal updated");
//     } else {
//       console.log("Adding goal:", goal);
//       // Try to add to backend/store
//       addSavingsGoal(goal);

//       // Defensive: if addSavingsGoal doesn't update store, patch it locally:
//       try {
//         // If your store uses updateSavingsData to set the full object:
//         updateSavingsData({
//           savingsGoals: [
//             ...(savingsData?.savingsGoals ?? []),
//             {
//               id: goal.id,
//               name: goal.name,
//               targetAmount: Number(goal.targetAmount),
//               currentAmount: Number(goal.currentAmount ?? 0),
//               targetDate: goal.targetDate,
//               contributionType: goal.contributionType ?? "monthly",
//             },
//           ],
//           // preserve moneySavings or override with contributionAmount
//           moneySavings: contributionAmount ?? savingsData?.moneySavings ?? 0,
//         });
//       } catch (err) {
//         console.warn("Local store patch failed, continuing — will reload from backend", err);
//       }

//       toast.success("Goal added");
//     }

//     // Recalculate results
//     const newResults = calculateSavings();
//     setResults(newResults);

//     // Option: reload canonical data from backend if you want absolute source of truth
//     await loadGoals(); // uncomment if you want to re-fetch from server
//     setResults(freshResults);

//     // Close modal & reset editing state
//     setEditingGoal(null);
//     setShowModal(false);
//     setContributionAmount(0);
//   } catch (err) {
//     console.error("handleAddOrUpdate error:", err);
//     toast.error("Failed to save goal. Check console and network.");
//   }
// };


//   const handleDelete = async (goalId: string) => {
//     if (!confirm("Are you sure you want to delete this goal?")) return;
//     if (isLoading || !user) return;

//     setIsDeleting(true);
//     try {
//       const token = await getAccessTokenSilently();
//       const res = await fetch(`https://financial-fortress.onrender.com/api/savings-goals/${goalId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err?.error || "Delete failed");
//       }
//       deleteSavingsGoal(goalId);
//       toast.success("Goal deleted");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete goal");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleContribute = (goal: SavingsGoal, extra: number) => {
//     try {
//       updateSavingsGoal(goal.id, {
//         ...goal,
//         currentAmount: goal.currentAmount + extra,
//       });
//       toast.success("Contribution saved");
//     } catch (err) {
//       console.error(err);
//       toast.error("Contribution failed");
//     }
//   };

//   const openAddModal = () => {
//     setEditingGoal(null);
//     setShowModal(true);
//   };

//   const openEditModal = (goal: SavingsGoal | null) => {
//     // If no goal was provided, open modal for adding a new goal
//     if (!goal) {
//       setEditingGoal(null);
//       setContributionAmount(savingsData?.moneySavings ?? 0);
//       setShowModal(true);
//       return;
//     }

//     setEditingGoal(goal);
//     setContributionAmount(
//       goal.userContribution ?? savingsData.moneySavings ?? 0
//     );
//     setShowModal(true);
//   };

//   return {
//     // data
//     savingsData,
//     results,
//     loading,
//     isDeleting,
//     showModal,
//     editingGoal,
//     contributionAmount,
//     // actions
//     setShowModal,
//     setContributionAmount,
//     openAddModal,
//     openEditModal,
//     handleAddOrUpdate,
//     handleDelete,
//     handleContribute,
//     reload: loadGoals,
//   };
// }


// src/hooks/useSavingsTracker.ts
import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useCalculator } from "@/store/Calculator/index";
import type { SavingsGoal, SavingsData } from "@/types"; // adjust import path

const API_BASE = "https://financial-fortress.onrender.com/api"; // change if needed

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
      toast.error("Unable to load savings goals");
    } finally {
      setLoading(false);
    }
  }, [isLoading, user, getAccessTokenSilently, updateSavingsData]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    setResults(calculateSavings());
  }, [savingsData, calculateSavings]);

  const handleAddOrUpdate = async (goal: SavingsGoal) => {
    const freshResults = calculateSavings();

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
      await loadGoals(); // keep canonical source-of-truth
      setResults(freshResults);
      setEditingGoal(null);
      setShowModal(false);
      setContributionAmount(0);
    } catch (err) {
      console.error("handleAddOrUpdate:", err);
      toast.error("Failed to save goal");
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
    setEditingGoal(null);
    setContributionAmount(savingsData?.moneySavings ?? 0);
    setShowModal(true);
  };

  const openEditModal = (goal: SavingsGoal | null) => {
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
  };
}
