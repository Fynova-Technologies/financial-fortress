import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoalCard from "./GoalCard";
import { SavingsGoal } from "./types";

type Props = {
  savingsData: any;
  results: any;
  onEdit: (g: SavingsGoal | null) => void;
  onDelete: (id: string) => void;
  onContribute: (g: SavingsGoal, amount: number) => void;
  isDeleting?: boolean;
};

export default function GoalsList({
  savingsData,
  results,
  onEdit,
  onDelete,
  onContribute,
  isDeleting,
}: Props) {
  // Merge savingsGoals with their results (if available)
  const mergedGoals = (savingsData?.savingsGoals || []).map((goal: SavingsGoal) => {
    const result = results?.goalResults?.find((r: any) => r.id === goal.id);
    return { ...goal, ...result }; // keep goal always, add extra info if result exists
  });

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Track Goals</h3>
          <button onClick={() => onEdit(null)}><strong>+ Add Goal</strong></button>
        </div>

        <div className="space-y-4">
          {mergedGoals.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>No savings goals yet. Add your first goal!</p>
            </div>
          ) : (
            mergedGoals.map((g: SavingsGoal) => (
              <GoalCard
                key={g.id}
                goal={g}
                onEdit={() => onEdit(g)}
                onDelete={() => onDelete(g.id)}
                onContribute={async () => {
                  const extra = parseFloat(prompt("How much did you save?") || "0");
                  if (extra > 0) await onContribute(g, extra);
                }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
