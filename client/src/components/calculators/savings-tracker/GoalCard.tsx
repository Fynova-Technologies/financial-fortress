import React from "react";
import { formatCurrency } from "@/lib/utils";

type Goal = {
  name: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  progressPercentage?: number; // optional
  neededContribution?: number;
};

type Props = {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: () => void;
};

export default function GoalCard({ goal, onEdit, onDelete, onContribute }: Props) {
  // Calculate progress percentage
  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

  // Calculate needed contribution per remaining month (optional)
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const monthsRemaining = Math.max(1, Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
  ));
  const neededContribution = remainingAmount / monthsRemaining;

  // Dynamic color based on progress
  let progressColor = "bg-red-500"; // 0-49% red
  if (progress >= 50 && progress < 80) progressColor = "bg-yellow-400";
  else if (progress >= 80) progressColor = "bg-green-500";

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{goal.name}</h4>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="hover:text-primary-500"><i className="fas fa-edit"></i></button>
          <button onClick={onDelete} className="hover:text-red-700"><i className="fas fa-trash"></i></button>
          <button onClick={onContribute} className="hover:text-primary-500"><i className="fas fa-donate"></i></button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
          <span className="font-medium">{progress.toFixed(0)}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-2">
        <div>
          <span className="block">Target Date:</span>
          <span className="font-medium">{new Date(goal.targetDate).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block">Needed / Month:</span>
          <span className="font-medium">{formatCurrency(neededContribution)}</span>
        </div>
      </div>
    </div>
  );
}
