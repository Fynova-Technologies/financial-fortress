import { useState, forwardRef, useEffect, useMemo } from "react";
import { useBudgetCalculator } from "@/store/index.js";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Expense } from "@/types";
import IncomeInput from "../forms/InputIncome";
import { useAuth0 } from "@auth0/auth0-react";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export const BudgetPlanner = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    budgetData,
    updateBudgetData,
    addExpense,
    updateExpense,
    deleteExpense,
    saveBudgetToServer
  } = useBudgetCalculator();

  // Calculate category totals from actual expenses
  const calculatedCategories = useMemo(() => {
    const categoryTotals = new Map<string, number>();

    // Initialize with base categories
    budgetData.expenseCategories.forEach((cat) => {
      categoryTotals.set(cat.category_id, 0);
    });

    // Sum up expenses by category
    budgetData.expenses.forEach((expense) => {
      const current = categoryTotals.get(expense.category) || 0;
      categoryTotals.set(expense.category, current + expense.amount);
    });

    // Return categories with calculated amounts
    return budgetData.expenseCategories.map((cat) => ({
      ...cat,
      amount: categoryTotals.get(cat.category_id) || 0,
    }));
  }, [budgetData.expenseCategories, budgetData.expenses]);

  // Calculate total expenses from actual expense items
  const totalExpenses = useMemo(() => {
    return budgetData.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }, [budgetData.expenses]);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    id: "",
    description: "",
    category: budgetData.expenseCategories[0]?.category_id || "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [income, setIncome] = useState<number | "">("");
  const [submittedIncome, setSubmittedIncome] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedExpense, setEditedExpense] = useState<Partial<Expense>>({});
  const windowWidth = useWindowWidth();
  const outerRadius = window.innerWidth >= 768 ? 80 : 50;

useEffect(() => {
  if (budgetData.totalIncome > 0) {
    setSubmittedIncome(budgetData.totalIncome);
  }   
}, [budgetData.totalIncome]);

const handleAddExpense = async () => {

  if (!newExpense.description?.trim()) {
    return alert("Please enter a description.");
  }

  if (!newExpense.category) {
    return alert("Please select a category.");
  }

  if (newExpense.amount == null || isNaN(newExpense.amount)) {
    return alert("Please enter a valid amount.");
  }

  if (!newExpense.date) {
    return alert("Please select a date.");
  }
  const newId = Date.now().toString();
  addExpense({
    id: newId,
    description: newExpense.description || "",
    category: newExpense.category || "",
    date: newExpense.date || "",
    amount: newExpense.amount || 0,
  });
  setNewExpense({
    id: "",
    description: "",
    category: budgetData.expenseCategories[0]?.category_id || "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
  });
  setShowAddExpenseModal(false);
  
  // Save to server after adding expense
  await saveBudgetToServer();
};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]:
        name === "amount" ? (value === "" ? 0 : parseFloat(value)) : value,
    });
  };

  const filteredExpenses = budgetData?.expenses?.filter((expense) => {
    const matchesSearch = (expense.description?.trim() || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Categories" ||
      budgetData.expenseCategories.find(
        (cat) => cat.category_id === expense.category
      )?.name === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getExpenseCategoryColor = (categoryId: string) => {
    const category = budgetData.expenseCategories.find(
      (cat) => cat.category_id === categoryId
    );
    return category ? category.color : "#718096";
  };

const handleSubmit = async () => {
  if (income !== "") {
    const numericIncome = Number(income);
    setSubmittedIncome(numericIncome);
    updateBudgetData({ totalIncome: numericIncome });
    setIncome("");
    
    // Save to server after updating
    await saveBudgetToServer();
  }
};

  // Filter categories for pie chart (only show categories with expenses)
  const filteredCategories = calculatedCategories.filter(
    (cat) => cat.amount > 0
  );

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-1">
        <CardContent className="p-6">
          <IncomeInput
            income={income}
            setIncome={setIncome}
            onSubmit={handleSubmit}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {" "}
            Add Your All expenses{" "}
          </p>
          <div className="flex justify-start">
            <Button
              onClick={() => setShowAddExpenseModal(true)}
              variant="outline"
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary Card */}
      <Card
        ref={ref}
        className="bg-white dark:bg-gray-800 shadow-md lg:col-span-3"
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Budget Overview
          </h3>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Income
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(budgetData.totalIncome)}
              </p>
            </div>
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Expenses
              </p>
              <p
                className={`text-2xl font-bold ${
                  totalExpenses > budgetData.totalIncome
                    ? "text-error"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remaining
              </p>
              <p
                className={`text-2xl font-bold ${
                  budgetData.totalIncome - budgetData.totalExpenses < 0
                    ? "text-red-500"
                    : "text-success"
                }`}
              >
                {formatCurrency(budgetData.totalIncome - totalExpenses)}
              </p>
            </div>
          </div>

          {/* Budget Chart - now uses calculated categories */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={outerRadius}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="name"
                  label={({ name, percent }) =>
                    window.innerWidth >= 768
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {filteredCategories?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddExpenseModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-black dark:text-gray-300 hover:bg-primary-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Add More Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories - now uses calculated categories */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
          <div className="space-y-4">
            {calculatedCategories?.map((category, index) => (
              <div
                key={category.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium lg:text-[10px]">{category.name}</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 lg:hidden xl:flex">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${
                        totalExpenses > 0
                          ? (category.amount / totalExpenses) * 100
                          : 0
                      }%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                  <span>
                    {Math.round(
                      totalExpenses > 0
                        ? (category.amount / totalExpenses) * 100
                        : 0
                    )}
                    % of expenses
                  </span>
                  <span>
                    {Math.round(
                      budgetData.totalIncome > 0
                        ? (category.amount / budgetData.totalIncome) * 100
                        : 0
                    )}
                    % of income
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Details */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-3">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Expense Breakdown</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                {budgetData?.expenseCategories?.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses?.map((expense) => {
                  const isEditing = editingId === expense.id;
                  return (
                    <tr key={expense.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {isEditing ? (
                          <input
                            type="text"
                            value={
                              editedExpense.description ?? expense.description
                            }
                            onChange={(e) =>
                              setEditedExpense({
                                ...editedExpense,
                                description: e.target.value,
                              })
                            }
                            className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
                          />
                        ) : (
                          expense.description
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {isEditing ? (
                          <select
                            value={editedExpense.category ?? expense.category}
                            onChange={(e) =>
                              setEditedExpense({
                                ...editedExpense,
                                category: e.target.value,
                              })
                            }
                            className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
                          >
                            {budgetData.expenseCategories.map((cat) => (
                              <option key={cat.id} value={cat.category_id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="px-2 py-1 rounded-full text-xs"
                            style={{
                              backgroundColor: `${getExpenseCategoryColor(
                                expense.category
                              )}20`,
                              color: getExpenseCategoryColor(expense.category),
                            }}
                          >
                            {budgetData.expenseCategories.find((cat)=> cat.category_id === expense.category)?.name || expense.category}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            value={
                              // Prefer the edited value when present; if not, fall back to expense.date if present;
                              // otherwise provide an empty string (valid for <input type="date">).
                              editedExpense.date
                                ? new Date(editedExpense.date)
                                    .toISOString()
                                    .split("T")[0]
                                : expense.date
                                ? new Date(expense.date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditedExpense({
                                ...editedExpense,
                                date: e.target.value,
                              })
                            }
                            className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
                          />
                        ) : // When not editing, only call new Date(...) if expense.date exists.
                        expense.date ? (
                          new Date(expense.date).toLocaleDateString()
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editedExpense.amount ?? expense.amount}
                            onChange={(e) =>
                              setEditedExpense({
                                ...editedExpense,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
                          />
                        ) : (
                          formatCurrency(expense.amount)
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                updateExpense(expense.id, editedExpense);
                                setEditingId(null);
                                setEditedExpense({});
                              }}
                              className="text-green-500 hover:text-green-600 mr-2"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditedExpense({});
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                              onClick={() => {
                                setEditingId(expense.id);
                                setEditedExpense(expense);
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="ml-3 text-gray-600 dark:text-gray-400 hover:text-error"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredExpenses?.length} of{" "}
              {budgetData?.expenses?.length} expenses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter expense details to add to your budget.
            </DialogDescription>
          </DialogHeader>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAddExpense();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Groceries at Whole Foods"
                value={newExpense.description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={
                  newExpense.category ||
                  budgetData.expenseCategories[0]?.category_id ||
                  ""
                }
                onChange={handleInputChange}
              >
                {budgetData.expenseCategories.length === 0 ? (
                  <option disabled>No categories available</option>
                ) : (
                  budgetData.expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newExpense.date || ""}
                onChange={handleInputChange}
              />
            </div>
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
            type="button"
              variant="outline"
              onClick={() => setShowAddExpenseModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});
