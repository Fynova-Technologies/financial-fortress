import { forwardRef, useEffect, useState } from "react";
import { useCalculator } from "@/store/calculator-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
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
  Line
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
import { savingsGoals } from "server/src/models/schema";

export const SavingsTracker = forwardRef<HTMLDivElement>((_, ref) => {
  const { savingsData, updateSavingsData, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, calculateSavings } = useCalculator();
  const [results, setResults] = useState<any>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    id: "",
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0]
  });

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [savingsData]);

  const handleCalculate = () => {
    const savingsResults = calculateSavings();
    setResults(savingsResults);
  };

  // const handleAddGoal = () => {
  //   if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
  //     return;
  //   }

  //   const newId = Date.now().toString();
  //   addSavingsGoal({
  //     id: newId,
  //     name: newGoal.name || "",
  //     targetAmount: newGoal.targetAmount || 0,
  //     currentAmount: newGoal.currentAmount || 0,
  //     targetDate: newGoal.targetDate || ""
  //   });

  //   setNewGoal({
  //     id: "",
  //     name: "",
  //     targetAmount: 0,
  //     currentAmount: 0,
  //     targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0]
  //   });
  //   setShowAddGoalModal(false);
  // };

  const handleAddGoal = () => {
  if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
    return;
  }

  if (editingGoalId) {
    // Edit existing goal
    updateSavingsGoal(editingGoalId, {
      id: editingGoalId,
      name: newGoal.name || "",
      targetAmount: newGoal.targetAmount || 0,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate || ""
    });
  } else {
    // Add new goal
    const newId = Date.now().toString();
    addSavingsGoal({
      id: newId,
      name: newGoal.name || "",
      targetAmount: newGoal.targetAmount || 0,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate || ""
    });
  }

  // Reset form and close modal
  resetForm();
};

const resetForm = () => {
  setNewGoal({
    id: "",
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0]
  });
  setEditingGoalId(null);
  setShowAddGoalModal(false);
};
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: name === 'targetAmount' || name === 'currentAmount' ? parseFloat(value) : value
    });
  };

  const handleMonthlyContribution = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateSavingsData({ monthlySavings: value });
  };

  // Prepare chart data from projection results
  const getProjectionChartData = () => {
    if (!results?.chartData) return [];
    
    const chartData = results.chartData.filter((_: any, i: number) => i % 3 === 0); // Show every 3rd month for clarity
    return chartData.map((data: any) => ({
      date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      ...data.goals.reduce((acc: any, goal: any) => {
        acc[goal.name] = goal.amount;
        return acc;
      }, {})
    }));
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
            <h3 className="text-lg font-semibold">Savings Goals</h3>
            <Button 
              onClick={() => setShowAddGoalModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
              size="sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Goal
            </Button>
          </div>
          
          <div className="space-y-4">
            {savingsData.savingsGoals.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <i className="fas fa-piggy-bank text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600 dark:text-gray-400">No savings goals yet. Add your first goal!</p>
              </div>
            ) : (
              <>
                {results && results.goalResults && results.goalResults.map((goal: any) => (
                  <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{goal.name}</h4>
                      <div className="flex space-x-1">
                        <button 
                          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                          onClick={() => {
                            setEditingGoalId(goal.id);
                            setNewGoal({
                              id: goal.id,
                              name: goal.name,
                              targetAmount: goal.targetAmount,
                              currentAmount: goal.currentAmount,
                              targetDate: new Date(goal.targetDate).toISOString().split('T')[0]
                            });
                            setShowAddGoalModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="text-gray-600 dark:text-gray-400 hover:text-error"
                          onClick={() => deleteSavingsGoal(goal.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className={`font-medium ${goal.isOnTrack ? 'text-success' : 'text-error'}`}>
                          {goal.progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${goal.isOnTrack ? 'bg-success' : 'bg-primary-500'}`}
                          style={{ width: `${goal.progressPercentage}%` }}
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
                        <span className="block">Monthly Needed:</span>
                        <span className={`font-medium ${goal.isAchievable ? 'text-success' : 'text-error'}`}>
                          {formatCurrency(goal.monthlyNeeded)}
                        </span>
                      </div>
                      <div>
                        <span className="block">Status:</span>
                        <span className={`font-medium ${goal.isOnTrack ? 'text-success' : 'text-error'}`}>
                          {goal.isOnTrack ? 'On track' : 'Off track'}
                        </span>
                      </div>
                      <div>
                        <span className="block">Expected Completion:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {new Date(goal.expectedCompletionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Contribution ($)</Label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={savingsData.monthlySavings || ""} 
                      onChange={handleMonthlyContribution}
                      placeholder="800"
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Savings Projections Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Savings Projections</h3>
          
          {results && savingsData.savingsGoals.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Saved</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.totalSaved)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Target</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalTarget)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Progress</p>
                  <p className="text-2xl font-bold text-success">
                    {((results.totalSaved / results.totalTarget) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              
              {/* Savings Projection Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Savings Growth Projection</h4>
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
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      {savingsData.savingsGoals.map((goal, index) => (
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
                <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Recommendations</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {savingsData.monthlySavings < results.goalResults.reduce((sum: number, goal: any) => sum + goal.monthlyNeeded, 0) && (
                    <li className="flex items-start">
                      <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                      <span>Consider increasing your monthly savings to {formatCurrency(results.goalResults.reduce((sum: number, goal: any) => sum + goal.monthlyNeeded, 0))} to meet all your goals on time.</span>
                    </li>
                  )}
                  {results.goalResults.some((goal: any) => !goal.isOnTrack) && (
                    <li className="flex items-start">
                      <i className="fas fa-exclamation-triangle text-warning mt-1 mr-2"></i>
                      <span>Some of your goals are off track. Consider adjusting your target dates or increasing your contributions.</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <i className="fas fa-lightbulb text-blue-500 mt-1 mr-2"></i>
                    <span>Automating your savings can help ensure consistent progress toward your goals.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
          
          {(!results || savingsData.savingsGoals.length === 0) && (
            <div className="text-center p-8">
              <i className="fas fa-chart-line text-gray-300 text-6xl mb-4"></i>
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No Data to Display</h4>
              <p className="text-gray-500 dark:text-gray-500 mb-4">Add a savings goal to see your projections here.</p>
              <Button 
                onClick={() => setShowAddGoalModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Your First Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Goal Modal */}
      <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoalId ? 'Edit Savings Goal' : 'Add New Savings Goal'}</DialogTitle>
            <DialogDescription>
              Enter your savings goal details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                value={newGoal.name}
                onChange={handleInputChange}
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
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              // onClick={() => setShowAddGoalModal(false)}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>{editingGoalId ? 'Save Changes' : 'Add Goal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
})
