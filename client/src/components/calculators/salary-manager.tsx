import { forwardRef, useEffect, useState } from "react";
import { useCalculator } from "@/store/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export const SalaryManager = forwardRef<HTMLDivElement>((_, ref) => {
  const { salaryData, updateSalaryData, calculateSalary } = useCalculator();
  const [results, setResults] = useState<any>(null);
  const width = useWindowWidth();
  const outerRadius = window.innerWidth >= 768 ? 80 : 50;

  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("access token granted Salary Manager: ", token);

        const res = await fetch("https://financial-fortress.onrender.com/api/salary-management", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const payload = await res.json();

        if (!res.ok) {
          console.error("Server responded", res.status, payload);
          throw new Error(payload.error || "Failed to load salary data");
        }

        // now payload is your Array
        const allCalculations = payload as Array<{
          grossSalary: number;
          taxRate: number;
          deductions: number;
          bonuses: number;
          period?: "monthly" | "annual";
          createdAt: string;
        }>;

        // If no data, return early
        if (allCalculations.length === 0) return;
        const initialData = allCalculations.reduce((a, b) =>
          new Date(a.createdAt || "").getTime() >
          new Date(b.createdAt || "").getTime()
            ? a
            : b
        );

        updateSalaryData({
          grossSalary: initialData.grossSalary,
          taxRate: initialData.taxRate,
          deductions: initialData.deductions,
          bonuses: initialData.bonuses,
          period: initialData.period || "monthly",
        });
      } catch (error) {
        console.error("Error fetching salary data:", error);
      }
    };

    if (user) {
      fetchSalaryData();
    }
  }, [getAccessTokenSilently, user]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [salaryData]);

  const handleCalculate = () => {
    const calculationResults = calculateSalary();
    setResults(calculationResults);
  };

  const handleInputChange = (field: string, value: number | string) => {
    if (field === "period") {
      updateSalaryData({ period: value as "monthly" | "annual" });
    } else {
      updateSalaryData({ [field]: typeof value === "string" ? 0 : value });
    }
  };

  // Format data for the pie chart
  const getBreakdownChartData = () => {
    if (!results) return [];

    return results.chartData;
  };

  // Format data for the bar chart
  const getPayFrequencyData = () => {
    if (!results) return [];

    return [
      { name: "Annual", value: results.annualNetSalary },
      { name: "Monthly", value: results.monthlyNetSalary },
      { name: "Bi-Weekly", value: results.biweeklyNetPay },
      { name: "Weekly", value: results.weeklyNetPay },
    ];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Salary Details</h3>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary Period
              </Label>
              <Select
                value={salaryData.period}
                onValueChange={(value: "monthly" | "annual") =>
                  handleInputChange("period", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={salaryData.period} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gross Salary (
                {salaryData.period === "monthly" ? "monthly" : "annual"})
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={salaryData.grossSalary || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "grossSalary",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={
                    salaryData.period === "monthly" ? "5,000" : "60,000"
                  }
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax Rate (%)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={salaryData.taxRate || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "taxRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="50"
                  step="0.1"
                  placeholder="25"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">%</span>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={salaryData.taxRate || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "taxRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deductions (
                {salaryData.period === "monthly" ? "monthly" : "annual"})
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={salaryData.deductions || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "deductions",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={
                    salaryData.period === "monthly" ? "500" : "6,000"
                  }
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bonuses (
                {salaryData.period === "monthly" ? "monthly" : "annual"})
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={salaryData.bonuses || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "bonuses",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={
                    salaryData.period === "monthly" ? "200" : "2,400"
                  }
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>

            {/* <div className="pt-2">
              <Button 
                onClick={handleCalculate}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
              >
                Calculate Salary
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card
        ref={ref}
        className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2"
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>

          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Annual Net Salary
                  </p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.annualNetSalary)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    After tax and deductions
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Monthly Take-Home Pay
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.monthlyNetSalary)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCurrency(results.biweeklyNetPay)} bi-weekly |{" "}
                    {formatCurrency(results.weeklyNetPay)} weekly
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                {/* Salary Distribution Chart */}
                <div>
                  <h4 className="text-md font-semibold mb-3">
                    Salary Distribution
                  </h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getBreakdownChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={outerRadius}
                          fill="#8884d8"
                          dataKey="value"
                          // label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          label={({ name, percent }) => 
                              window.innerWidth >= 768
                                ? `${name}: ${(percent * 100).toFixed(0)}%`
                                : `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {getBreakdownChartData().map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${index + 1}))`}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pay Frequency Chart */}
                <div>
                  <h4 className="text-md font-semibold mb-3">
                    Pay by Frequency
                  </h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getPayFrequencyData()}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <h4 className="text-md font-semibold mb-3">
                  Detailed Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Annual
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Monthly
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {results.breakdown.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {item.category}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                              item.amount < 0
                                ? "text-error"
                                : item.category === "Net Salary"
                                ? "text-success"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatCurrency(item.amount)}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                              item.amount < 0
                                ? "text-error"
                                : item.category === "Net Salary"
                                ? "text-success"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatCurrency(item.amount / 12)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Tax Information
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-2">
                    Your effective tax rate is approximately{" "}
                    {salaryData.taxRate}%.
                  </p>
                  <p>
                    Note: This is a simplified calculation. Actual tax rates
                    vary based on your location, filing status, deductions, and
                    other factors. Consult a tax professional for personalized
                    advice.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
