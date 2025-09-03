import { useEffect, useState } from "react";
import { useCalculator } from "@/store/Calculator/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SavingsGoal } from "@/types";
import toast from "react-hot-toast";

export const SavingsTracker = () => {
  const {
    savingsData,
    updateSavingsData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateSavings,
  } = useCalculator();
  const [results, setResults] = useState<any>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    id: "",
    name: "",
    targetAmount: 0,
    contributionType: "monthly",
    currentAmount: 0,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
      .toISOString()
      .split("T")[0],
  });
  const [contributionAmount, setContributionAmount] = useState<number>(0);

  const { getAccessTokenSilently, isLoading, user } = useAuth0();

  useEffect(() => {
    const saveData = async () => {
      if (isLoading) {
        console.warn("Auth0 is still loading—try again later.");
        return;
      }

      if (!user) {
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        console.log("access token granted Savings Tracker: ", token);

        const res = await fetch("http://financial-fortress.onrender.com/api/savings-goals", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const allCalculations: Array<{
          id: string;
          name: string;
          target_amount: string;
          current_amount: string;
          target_date: string;
          created_at: string;
          monthly_savings?: number;
        }> = await res.json();

        if (allCalculations.length === 0) return;
        const latest = allCalculations.reduce((a, b) =>
          new Date(a.created_at) > new Date(b.created_at) ? a : b
        );

        updateSavingsData({
          savingsGoals: allCalculations.map((g) => ({
            id: String(g.id),
            name: g.name,
            targetAmount: parseFloat(g.target_amount),
            contributionType: "monthly",
            currentAmount: parseFloat(g.current_amount),
            targetDate: g.target_date.split("T")[0],
          })),
          moneySavings: latest.monthly_savings || 0,
        });
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save Savings Tracker data");
      }
    };
    saveData();
  }, [user, getAccessTokenSilently, isLoading]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [savingsData]);

  const handleCalculate = () => {
    const savingsResults = calculateSavings();
    setResults(savingsResults);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goalData: SavingsGoal = {
      id: editingGoalId || Date.now().toString(),
      name: newGoal.name || "",
      targetAmount: newGoal.targetAmount || 0,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate || "",
      contributionType: newGoal.contributionType as
        | "daily"
        | "monthly"
        | "quarterly"
        | "annually",
    };

    if (editingGoalId) {
      updateSavingsGoal(editingGoalId, goalData);
    } else {
      addSavingsGoal(goalData);
    }

    // Update the global contribution amount
    updateSavingsData({ moneySavings: contributionAmount });

    resetForm();
  };

  const resetForm = () => {
    setNewGoal({
      id: "",
      name: "",
      targetAmount: 0,
      contributionType: "monthly",
      currentAmount: 0,
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
        .toISOString()
        .split("T")[0],
    });
    setContributionAmount(0);
    setEditingGoalId(null);
    setShowAddGoalModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "targetDate") {
      const today = new Date().toISOString().split("T")[0];
      const validDate = value < today ? today : value; // clamp to today
      setNewGoal({ ...newGoal, [name]: validDate });
      return;
    }

    setNewGoal({
      ...newGoal,
      [name]:
        name === "targetAmount" || name === "currentAmount"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    });
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      contributionType: goal.contributionType,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
    });
    setContributionAmount(goal.userContribution || savingsData.moneySavings);
    setShowAddGoalModal(true);
  };

  // Prepare chart data from projection results
  const getProjectionChartData = () => {
    if (!results?.chartData) return [];

    const chartData = results.chartData.filter(
      (_: any, i: number) => i % 3 === 0
    );
    return chartData.map((data: any) => ({
      date: new Date(data.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      ...data.goals.reduce((acc: any, goal: any) => {
        acc[goal.name] = goal.amount;
        return acc;
      }, {}),
    }));
  };

  const getContributionLabel = (contributionType: string) => {
    switch (contributionType) {
      case "daily":
        return "Daily";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "annually":
        return "Annual";
      default:
        return "Monthly";
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Goals Summary Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Track Goals</h3>
            <Button
              onClick={() => setShowAddGoalModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-gray-700 dark:text-white"
              size="sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Goal
            </Button>
          </div>

          <div className="space-y-4">
            {!savingsData?.savingsGoals ||
            savingsData.savingsGoals.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <i className="fas fa-piggy-bank text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600 dark:text-gray-400">
                  No savings goals yet. Add your first goal!
                </p>
              </div>
            ) : (
              <>
                {results &&
                  results.goalResults &&
                  results.goalResults.map((goal: any) => (
                    <div
                      key={goal.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{goal.name}</h4>
                        <div className="flex space-x-1">
                          <button
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="text-gray-600 dark:text-gray-400 hover:text-error"
                            onClick={() => deleteSavingsGoal(goal.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button
                            className="mt-2 py-1.5 px-1.5 rounded-md bg-gray-300 dark:text-white dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                            onClick={() => {
                              const extra = parseFloat(
                                prompt("How much did you save?") || "0"
                              );
                              if (extra > 0) {
                                updateSavingsGoal(goal.id, {
                                  ...goal,
                                  currentAmount: goal.currentAmount + extra,
                                });
                              }
                            }}
                          >
                            <i className="fas fa-plus-circle"></i> Contribute
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatCurrency(goal.currentAmount)} of{" "}
                            {formatCurrency(goal.targetAmount)}
                          </span>
                          <span
                            className={`font-medium ${
                              goal.status === "completed"
                                ? "text-green-500"
                                : goal.status === "onTrack"
                                ? "text-success"
                                : goal.status === "offTrack"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {goal.progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              goal.status === "completed"
                                ? "bg-green-500"
                                : goal.status === "onTrack"
                                ? "bg-success"
                                : goal.status === "offTrack"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                goal.progressPercentage
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-2">
                        <div>
                          <span className="block">Target Date:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="block">
                            {getContributionLabel(goal.contributionType)}{" "}
                            Needed:
                          </span>
                          <span
                            className={`font-medium ${
                              goal.isAchievable ? "text-success" : "text-error"
                            }`}
                          >
                            {formatCurrency(goal.neededContribution)}
                          </span>
                        </div>
                        <div>
                          <span className="block">Status:</span>
                          <span
                            className={`font-medium ${
                              goal.status === "completed"
                                ? "text-green-500"
                                : goal.status === "onTrack"
                                ? "text-success"
                                : goal.status === "offTrack"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {goal.status === "completed"
                              ? "Completed"
                              : goal.status === "onTrack"
                              ? "On track"
                              : goal.status === "offTrack"
                              ? "Off track"
                              : "Overdue"}
                          </span>
                        </div>
                        <div>
                          <span className="block">Expected Completion:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {new Date(
                              goal.expectedCompletionDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Savings Projections Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Savings Projections</h3>

          {results?.goalResults?.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Saved
                  </p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.totalSaved)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Target
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalTarget)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Overall Progress
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {results.totalTarget > 0
                      ? (
                          (results.totalSaved / results.totalTarget) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </p>
                </div>
              </div>

              {/* Savings Projection Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">
                  Savings Growth Projection
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getProjectionChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis
                        tickFormatter={(value) =>
                          value >= 1000000
                            ? `$${(value / 1000000).toFixed(1)}M`
                            : value >= 1000
                            ? `$${(value / 1000).toFixed(0)}K`
                            : `$${value}`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      {savingsData?.savingsGoals?.map((goal, index) => (
                        <Line
                          key={goal.id}
                          type="monotone"
                          dataKey={goal.name}
                          stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {results.totalMonthlyNeeded > 0 && (
                    <li className="flex items-start">
                      <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                      <span>
                        Total monthly equivalent needed across all goals:{" "}
                        {formatCurrency(results.totalMonthlyNeeded)}
                      </span>
                    </li>
                  )}
                  {results.goalResults?.some(
                    (goal: any) => !goal.isOnTrack && !goal.isCompleted
                  ) && (
                    <li className="flex items-start">
                      <i className="fas fa-exclamation-triangle text-warning mt-1 mr-2"></i>
                      <span>
                        Some goals are off track. Consider adjusting target
                        dates or increasing contributions.
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <i className="fas fa-lightbulb text-blue-500 mt-1 mr-2"></i>
                    <span>
                      Automating your savings can help ensure consistent
                      progress toward your goals.
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {(!results || savingsData?.savingsGoals?.length === 0) && (
            <div className="text-center p-8">
              <i className="fas fa-chart-line text-gray-300 text-6xl mb-4"></i>
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No Data to Display
              </h4>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Add a savings goal to see your projections here.
              </p>
              <Button
                onClick={() => setShowAddGoalModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-black dark:text-white"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Your First Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Goal Modal */}
      <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoalId ? "Edit Goal" : "Add New Goal"}
            </DialogTitle>
            <DialogDescription>
              Enter your savings goal details below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGoal();
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  value={newGoal.name}
                  onChange={handleInputChange}
                  maxLength={28}
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  placeholder="10000"
                  value={newGoal.targetAmount || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contributionType">Contribution Type</Label>
                <select
                  id="contributionType"
                  name="contributionType"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={newGoal.contributionType || "monthly"}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      contributionType: e.target.value as
                        | "daily"
                        | "monthly"
                        | "quarterly"
                        | "annually",
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <Label htmlFor="contributionAmount">
                  {getContributionLabel(newGoal.contributionType || "monthly")}{" "}
                  Contribution ($)
                </Label>
                <Input
                  id="contributionAmount"
                  type="number"
                  value={contributionAmount || ""}
                  onChange={(e) =>
                    setContributionAmount(parseFloat(e.target.value) || 0)
                  }
                  placeholder="800"
                  className="w-full"
                  min={0}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentAmount">Current Savings ($)</Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  placeholder="0"
                  value={newGoal.currentAmount || ""}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  name="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal} type="submit">
              {editingGoalId ? "Save Changes" : "Add Goal"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
