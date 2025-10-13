// import React from "react";
// import GoalsList from "./GoalsList";
// import Projections from "./Projections";
// import GoalModal from "./GoalModal";
// import { useSavingsTracker } from "./useSavingsTracker";
// import AuthPopup from "../../auth/AuthPopup";

// export default function SavingsTracker() {
//   const tracker = useSavingsTracker();

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <GoalsList
//         savingsData={tracker.savingsData}
//         results={tracker.results}
//         onEdit={tracker.openEditModal}
//         onDelete={tracker.handleDelete}
//         onContribute={tracker.handleContribute}
//         isDeleting={tracker.isDeleting}
//       />

//       <Projections
//         savingsData={tracker.savingsData}
//         results={tracker.results}
//         onAdd={() => tracker.openAddModal()}
//       />

//       <GoalModal
//         open={tracker.showModal}
//         editingGoal={tracker.editingGoal}
//         contributionAmount={tracker.contributionAmount}
//         setContributionAmount={tracker.setContributionAmount}
//         onClose={() => tracker.setShowModal(false)}
//         onSave={tracker.handleAddOrUpdate}
//       />

//       <AuthPopup
//         visible={tracker.showAuthPopup}
//         onLogin={() => {}}
//         onSignup={() => {}}
//         onClose={() => tracker.setShowAuthPopup(false)}
//       />
//     </div>
//   );
// }

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Target,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { mockApiResponses } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type GoalType = "savings" | "debt";
type DebtMethod = "snowball" | "avalanche" | null;

interface ProgressHistory {
  date: string;
  amount: number;
}

interface Goal {
  id: string;
  name: string;
  type: GoalType;
  target: number;
  current: number;
  deadline: string;
  interestRate?: number;
  debtMethod?: DebtMethod;
  history: ProgressHistory[];
}

export default function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      type: "savings",
      target: 10000,
      current: 6500,
      deadline: "2025-12-31",
      history: [
        { date: "2025-01", amount: 2000 },
        { date: "2025-04", amount: 4500 },
        { date: "2025-07", amount: 5800 },
        { date: "2025-10", amount: 6500 },
      ],
    },
    {
      id: "2",
      name: "Credit Card Debt",
      type: "debt",
      target: 5000,
      current: 2800,
      deadline: "2025-08-31",
      interestRate: 18.5,
      debtMethod: "avalanche",
      history: [
        { date: "2025-01", amount: 5000 },
        { date: "2025-04", amount: 4200 },
        { date: "2025-07", amount: 3400 },
        { date: "2025-10", amount: 2800 },
      ],
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    type: "savings" as GoalType,
    target: "",
    current: "",
    deadline: "",
    interestRate: "",
    debtMethod: null as DebtMethod,
  });

  const calculateProgress = (goal: Goal) => {
    if (goal.type === "debt") {
      return Math.min(((goal.target - goal.current) / goal.target) * 100, 100);
    }
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const isGoalBehindSchedule = (goal: Goal) => {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const totalDays =
      deadline.getTime() - new Date(goal.history[0]?.date || now).getTime();
    const daysElapsed =
      now.getTime() - new Date(goal.history[0]?.date || now).getTime();
    const expectedProgress = (daysElapsed / totalDays) * 100;
    const actualProgress = calculateProgress(goal);
    return actualProgress < expectedProgress - 10;
  };

  const handleCreateGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.current && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        type: newGoal.type,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current),
        deadline: newGoal.deadline,
        interestRate: newGoal.interestRate
          ? parseFloat(newGoal.interestRate)
          : undefined,
        debtMethod: newGoal.debtMethod,
        history: [
          {
            date: new Date().toISOString().slice(0, 7),
            amount: parseFloat(newGoal.current),
          },
        ],
      };
      setGoals([...goals, goal]);
      setNewGoal({
        name: "",
        type: "savings",
        target: "",
        current: "",
        deadline: "",
        interestRate: "",
        debtMethod: null,
      });
      setDialogOpen(false);
      toast({
        title: "Goal Created",
        description: `${goal.name} has been added to your goals.`,
      });
    }
  };

  const suggestAllocation = (goal: Goal) => {
    const daysLeft = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));

    if (goal.type === "debt") {
      const remaining = goal.current;
      let monthlyPayment = remaining / monthsLeft;

      if (goal.interestRate) {
        const monthlyRate = goal.interestRate / 100 / 12;
        monthlyPayment =
          (remaining * monthlyRate * Math.pow(1 + monthlyRate, monthsLeft)) /
          (Math.pow(1 + monthlyRate, monthsLeft) - 1);
      }

      toast({
        title: "Debt Payoff Plan",
        description: `Pay $${monthlyPayment.toFixed(2)}/month using ${
          goal.debtMethod || "standard"
        } method to clear ${goal.name} by deadline.`,
      });
    } else {
      const remaining = goal.target - goal.current;
      const monthlyRequired = remaining / monthsLeft;

      toast({
        title: "Savings Allocation",
        description: `Save $${monthlyRequired.toFixed(2)}/month to reach your ${
          goal.name
        } goal.`,
      });
    }
  };

  const savingsGoals = goals.filter((g) => g.type === "savings");
  const debtGoals = goals.filter((g) => g.type === "debt");

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Goals & Tracking
          </h1>
          <p className="text-muted-foreground">
            Track savings goals and debt payoff progress
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a financial goal or debt payoff plan and track your
                progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value: GoalType) =>
                    setNewGoal({ ...newGoal, type: value })
                  }
                >
                  <SelectTrigger id="goalType">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Goal</SelectItem>
                    <SelectItem value="debt">Debt Payoff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder={
                    newGoal.type === "debt"
                      ? "e.g., Credit Card"
                      : "e.g., Emergency Fund"
                  }
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">
                    {newGoal.type === "debt"
                      ? "Total Debt ($)"
                      : "Target Amount ($)"}
                  </Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="10000"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">
                    {newGoal.type === "debt"
                      ? "Remaining Balance ($)"
                      : "Current Amount ($)"}
                  </Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    placeholder="2500"
                    value={newGoal.current}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, current: e.target.value })
                    }
                  />
                </div>
              </div>

              {newGoal.type === "debt" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="18.5"
                      value={newGoal.interestRate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, interestRate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtMethod">Payoff Method</Label>
                    <Select
                      value={newGoal.debtMethod || ""}
                      onValueChange={(value) =>
                        setNewGoal({
                          ...newGoal,
                          debtMethod: value as DebtMethod,
                        })
                      }
                    >
                      <SelectTrigger id="debtMethod">
                        <SelectValue placeholder="Select payoff method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="snowball">
                          Snowball (Smallest balance first)
                        </SelectItem>
                        <SelectItem value="avalanche">
                          Avalanche (Highest interest first)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="deadline">Target Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                />
              </div>

              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="savings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="savings">
            Savings Goals ({savingsGoals.length})
          </TabsTrigger>
          <TabsTrigger value="debt">
            Debt Payoff ({debtGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-6 mt-6">
          {savingsGoals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No savings goals yet. Create one to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            savingsGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const isBehind = isGoalBehindSchedule(goal);
              return (
                <Card key={goal.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Target
                            className="h-5 w-5 text-primary"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <CardTitle>{goal.name}</CardTitle>
                          <CardDescription>
                            Target by{" "}
                            {new Date(goal.deadline).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => suggestAllocation(goal)}
                      >
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Suggest Allocation
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isBehind && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You're behind schedule! Consider increasing your
                          monthly savings to reach this goal on time.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          ${goal.current.toLocaleString()} of $
                          {goal.target.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {progress >= 75 ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-warning" />
                          )}
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="text-sm text-muted-foreground">
                        ${(goal.target - goal.current).toLocaleString()}{" "}
                        remaining
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">
                        Progress History
                      </h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={goal.history}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="debt" className="space-y-6 mt-6">
          {debtGoals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No debt payoff plans yet. Create one to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            debtGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const isBehind = isGoalBehindSchedule(goal);
              return (
                <Card key={goal.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-destructive/10 p-2">
                          <Target
                            className="h-5 w-5 text-destructive"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <CardTitle>{goal.name}</CardTitle>
                          <CardDescription>
                            Payoff by{" "}
                            {new Date(goal.deadline).toLocaleDateString()}
                            {goal.interestRate &&
                              ` • ${goal.interestRate}% APR`}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.debtMethod && (
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">
                            {goal.debtMethod}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => suggestAllocation(goal)}
                        >
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Payment Plan
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isBehind && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You're behind schedule! Consider increasing your
                          monthly payments to become debt-free on time.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          ${goal.current.toLocaleString()} remaining of $
                          {goal.target.toLocaleString()} original debt
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {progress >= 75 ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-warning" />
                          )}
                          {progress.toFixed(0)}% paid off
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="text-sm text-muted-foreground">
                        ${goal.current.toLocaleString()} left to pay
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Payoff History</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={goal.history}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--destructive))" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {goal.debtMethod && (
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong className="capitalize">
                            {goal.debtMethod} Method:
                          </strong>{" "}
                          {goal.debtMethod === "snowball"
                            ? "Focus on paying off smallest balances first for quick wins and motivation."
                            : "Focus on highest interest rates first to save the most money over time."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
