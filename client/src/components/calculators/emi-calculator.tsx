import { forwardRef, useEffect, useState } from "react";
import { useCalculator } from "@/store/Calculator/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { exportToExcelAmortization } from "@/utils/amortizationSchedule";
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

export const EMICalculator = forwardRef<HTMLDivElement>((_, ref) => {
  const { emiData, updateEMIData, calculateEMI } = useCalculator();
  const [results, setResults] = useState<any>(null);
  const [viewFullRepaymentSchedule, setViewFullRepaymentSchedule] =
    useState(false);
  const width = useWindowWidth();
  const outerRadius = window.innerWidth >= 768 ? 80 : 50;
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("access token granted EMI: ", token);

        const res = await fetch("http://financial-fortress.onrender.com/api/emi-calculations", {
          // method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const allCalculations: Array<{
          loanAmount: number;
          interestRate: number;
          loanTerm: number;
          termType: "years" | "months";
          startDate: string;
          createdAt: string;
        }> = await res.json();

        // Pick the most recent calculation
        if (allCalculations.length === 0) return;
        const latest = allCalculations.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );

        // Update context state with latest data
        updateEMIData({
          loanAmount: latest.loanAmount,
          interestRate: latest.interestRate,
          loanTerm: latest.loanTerm,
          termType: latest.termType,
          startDate: latest.startDate,
        });
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    if (user) {
      fetchSavedData();
    }
  }, [getAccessTokenSilently, user]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [emiData]);

  const handleCalculate = () => {
    const calculationResults = calculateEMI();
    setResults(calculationResults);
  };

  const handleLoanAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateEMIData({ loanAmount: value });
  };

  const handleInterestRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateEMIData({ interestRate: value });
  };

  const handleLoanTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateEMIData({ loanTerm: value });
  };

  const handleTermType = (value: "years" | "months") => {
    updateEMIData({ termType: value });
  };

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEMIData({ startDate: e.target.value });
  };

  const handleExportSchedule = () => {
    if (!results?.repaymentSchedule) {
      return;
    };

    // Format the data for export (only show year, principal, interest, balance)
    const dataToExport = results.repaymentSchedule.map((payment: any) => ({
      Date: payment.date,
      Emi: payment.emi,
      Principal: payment.principal,
      Interest: payment.interest,
      Balance: payment.balance,
    }));

    exportToExcelAmortization(dataToExport, "Amortization_Schedule");
  };

  // Chart data for payment breakdown
  const chartData = results
    ? [
        { name: "Principal", value: emiData.loanAmount },
        { name: "Interest", value: results.totalInterest },
      ].filter((item) => item.value > 0)
    : [];

  // First few payments for the schedule table
  const repaymentSchedule = results?.repaymentSchedule
    ? viewFullRepaymentSchedule
      ? results.repaymentSchedule
      : results.repaymentSchedule.slice(0, 5)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Loan Details</h3>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Amount ($)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={emiData.loanAmount || ""}
                  onChange={handleLoanAmount}
                  placeholder="25,000"
                  className="w-full"
                />
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={emiData.loanAmount || 0}
                  onChange={handleLoanAmount}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (% per annum)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={emiData.interestRate || ""}
                  onChange={handleInterestRate}
                  step="0.01"
                  min="1"
                  max="30"
                  placeholder="8.5"
                  className="w-full"
                />
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={emiData.interestRate || 0}
                  onChange={handleInterestRate}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Term
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={emiData.loanTerm || ""}
                  onChange={handleLoanTerm}
                  min="1"
                  max="30"
                  placeholder="5"
                  className="w-full"
                />
                <Select
                  value={emiData.termType}
                  onValueChange={(value: "years" | "months") =>
                    handleTermType(value)
                  }
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder={emiData.termType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </Label>
              <Input
                type="date"
                value={emiData.startDate ? emiData.startDate.split("T")[0] : ""}
                onChange={handleStartDate}
                className="w-full"
              />
            </div>

            {/* <div className="pt-2">
              <Button 
                onClick={handleCalculate}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
              >
                Calculate EMI
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* EMI Results Card */}
      <Card
        ref={ref}
        className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2"
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">EMI Summary</h3>

          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Monthly EMI
                  </p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.monthlyEMI)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Interest
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Payment
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalPayment)}
                  </p>
                </div>
              </div>

              {/* EMI Breakdown Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">
                  Payment Breakdown
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          window.innerWidth >= 768
                            ? `${name}: ${(percent * 100).toFixed(0)}%`
                            : `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--chart-${index + 1}))`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Repayment Schedule */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold">Repayment Schedule</h4>
                  <button
                    className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                    onClick={handleExportSchedule}
                  >
                    <i className="fas fa-download mr-1"></i>
                    Export Schedule
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Payment #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          EMI
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {repaymentSchedule.map((payment: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {payment.number}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {payment.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(payment.emi)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(payment.principal)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(payment.interest)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(payment.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  className="mt-3 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center"
                  onClick={() => setViewFullRepaymentSchedule((prev) => !prev)}
                >
                  {viewFullRepaymentSchedule
                    ? "Hide Full Repayment Schedule"
                    : "View Full Repayment Schedule"}
                  <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
