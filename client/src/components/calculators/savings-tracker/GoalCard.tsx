import React from "react";
import { formatCurrency } from "@/lib/utils";

export default function GoalCard({ goal, onEdit, onDelete, onContribute }: any) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
          <span className="font-medium">{goal.progressPercentage?.toFixed(0) ?? 0}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div className="h-2 rounded-full bg-primary-600" style={{ width: `${Math.min(100, goal.progressPercentage || 0)}%` }} />
        </div>
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-2">
        <div>
          <span className="block">Target Date:</span>
          <span className="font-medium">{new Date(goal.targetDate).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block">Needed:</span>
          <span className="font-medium">{formatCurrency(goal.neededContribution ?? 0)}</span>
        </div>
      </div>
    </div>
  );
}
