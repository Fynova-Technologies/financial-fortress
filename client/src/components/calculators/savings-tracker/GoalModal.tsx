import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "./types";
import { useSavingsTracker } from "./useSavingsTracker";

type Props = {
  open: boolean;
  editingGoal: SavingsGoal | null;
  contributionAmount: number;
  setContributionAmount: (v: number) => void;
  onClose: () => void;
  onSave: (g: SavingsGoal) => void;
};

export default function GoalModal({ open, editingGoal, contributionAmount, setContributionAmount, onClose, onSave }: Props) {
  const [form, setForm] = useState<Partial<SavingsGoal>>({
    id: "",
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split("T")[0],
    contributionType: "monthly",
  });
  const { savingGoal } = useSavingsTracker();

useEffect(() => {
  if (open) {
    if (editingGoal) {
      setForm(editingGoal);
    } else {
      setForm({
        id: "",
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
          .toISOString()
          .split("T")[0],
        contributionType: "monthly",
      });
      setContributionAmount(0); // also reset contributionAmount if needed
    }
  }
}, [open, editingGoal, setContributionAmount]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === "targetAmount" || name === "currentAmount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount || !form.targetDate) return;
    const goal: SavingsGoal = {
      id: editingGoal?.id ?? Date.now().toString(),
      name: form.name!,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount ?? 0),
      targetDate: String(form.targetDate),
      contributionType: form.contributionType as any,
    };
    onSave(goal);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>Enter your savings goal details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal Name</Label>
            <Input id="name" name="name" value={form.name || ""} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input id="targetAmount" name="targetAmount" type="number" value={form.targetAmount ?? ""} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="contributionType">Contribution Type</Label>
            <select name="contributionType" value={form.contributionType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div>
            <Label>Contribution Amount</Label>
            <Input type="number" value={contributionAmount || ""} onChange={(e) => setContributionAmount(parseFloat(e.target.value) || 0)} />
          </div>

          <div>
            <Label htmlFor="currentAmount">Current Savings ($)</Label>
            <Input id="currentAmount" name="currentAmount" type="number" value={form.currentAmount ?? ""} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input id="targetDate" name="targetDate" type="date" value={form.targetDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
          </div>

          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={savingGoal}>  {savingGoal ? (editingGoal ? "Saving..." : "Adding...") : editingGoal ? "Save Changes" : "Add Goal"} </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
