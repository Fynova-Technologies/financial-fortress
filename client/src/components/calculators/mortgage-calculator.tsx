import { forwardRef, useEffect, useState } from "react";
import { useCalculator } from "@/store/Calculator/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { exportToExcelAmortization } from "@/utils/amortizationSchedule";
import { useAuth0 } from "@auth0/auth0-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export const MortgageCalculator = forwardRef<HTMLDivElement>((_, ref) => {
  const { mortgageData, updateMortgageData, calculateMortgage } =
    useCalculator();
  const [results, setResults] = useState<any>(null);
  const [viewFullamortizationSchedule, setViewFullamortizationSchedule] =
    useState(false);
  const width = useWindowWidth();
  const { user, getAccessTokenSilently } = useAuth0();
  const outerRadius = window.innerWidth >= 768 ? 80 : 50;

  useEffect(() => {
    const loadMOrtgageData = async () => {
      try {
        if (!user || !getAccessTokenSilently) return;

        const token = await getAccessTokenSilently();
        console.log("access token granted Mortgage Calculator: ", token);
        const res = await fetch(
          "https://financial-fortress.onrender.com/api/mortgage-calculations",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        //  Parse JSON — this is an array of records
        const allCalculations: Array<{
          homePrice: number;
          downPaymentAmount: number;
          downPaymentPercent: number;
          interestRate: number;
          loanTerm: number;
          propertyTax: number;
          homeInsurance: number;
          pmi: number;
          createdAt: string;
        }> = await res.json();

        //  Pick the one you want (e.g. most recent by createdAt)
        if (allCalculations.length === 0) return;
        const latest = allCalculations.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );

        // Update your context state so inputs get prefilled
        updateMortgageData({
          homePrice: latest.homePrice,
          downPaymentAmount: latest.downPaymentAmount,
          downPaymentPercent: latest.downPaymentPercent,
          interestRate: latest.interestRate,
          loanTerm: latest.loanTerm,
          propertyTax: latest.propertyTax,
          homeInsurance: latest.homeInsurance,
          pmi: latest.pmi,
        });
      } catch (error) {
        console.error("Failed to load mortgage data:", error);
        alert("Failed to load mortgage data");
      }
    };
    if (user) {
      loadMOrtgageData();
    }
  }, [user, getAccessTokenSilently]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [mortgageData]);

  const handleCalculate = () => {
    const calculationResults = calculateMortgage();
    setResults(calculationResults);
  };

  const handleHomePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ homePrice: value });
  };

  const handleDownPaymentPercent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ downPaymentPercent: value });
  };

  const handleDownPaymentAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ downPaymentAmount: value });
  };

  const handleInterestRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ interestRate: value });
  };

  const handleLoanTerm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value) || 30;
    updateMortgageData({ loanTerm: value });
  };

  const handlePropertyTax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ propertyTax: value });
  };

  const handleHomeInsurance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ homeInsurance: value });
  };

  const handlePMI = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateMortgageData({ pmi: value });
  };

  const handleExportSchedule = () => {
    if (!results?.amortizationSchedule) {
      console.log("results: ", amortizationSchedule);
      return;
    }
    // Format the data for export (only show year, principal, interest, balance)
    const dataToExport = results.amortizationSchedule.map((year: any) => ({
      Year: year.year,
      Principal: year.principal,
      Interest: year.interest,
      Balance: year.balance,
    }));

    exportToExcelAmortization(dataToExport, "Amortization_Schedule");
  };

  // Payment breakdown chart data
  const paymentBreakdownData = results
    ? [
        { name: "Principal & Interest", value: results.monthlyPayment },
        { name: "Property Tax", value: mortgageData.propertyTax / 12 },
        { name: "Insurance", value: mortgageData.homeInsurance / 12 },
        ...(mortgageData.downPaymentPercent < 20
          ? [
              {
                name: "PMI",
                value: (results.loanAmount * (mortgageData.pmi / 100)) / 12,
              },
            ]
          : []),
      ].filter((item) => item.value > 0)
    : [];

  // Get first few years of amortization for the table
  const amortizationSchedule = results?.amortizationSchedule
    ? viewFullamortizationSchedule
      ? results.amortizationSchedule
      : results.amortizationSchedule.slice(0, 5)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mortgage Details</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Home Price ($)
              </Label>
              <Input
                type="number"
                value={mortgageData.homePrice || ""}
                onChange={handleHomePrice}
                placeholder="50,000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="mt-2">
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="5000"
                  value={mortgageData.homePrice || 0}
                  onChange={handleHomePrice}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>$50k</span>
                  <span>$1M</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Down Payment
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={mortgageData.downPaymentAmount || ""}
                  onChange={handleDownPaymentAmount}
                  placeholder="Down Payment Amount"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-600 dark:text-gray-400">$</span>
              </div>
              <div className="mt-4 flex items-center space-x-2 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={mortgageData.downPaymentPercent || 0}
                  onChange={handleDownPaymentPercent}
                  className="w-full"
                />
                <div className="absolute -top-6 right-0">
                  <span className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-10">
                    {mortgageData.downPaymentPercent?.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Term (Years)
              </Label>
              <select
                value={mortgageData.loanTerm || 30}
                onChange={handleLoanTerm}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (%)
              </Label>
              <Input
                type="number"
                value={mortgageData.interestRate || ""}
                onChange={handleInterestRate}
                placeholder="Set Interest Rate"
                step="0.01"
                min="0"
                max="15"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={mortgageData.interestRate || 0}
                  onChange={handleInterestRate}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Tax (yearly)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={mortgageData.propertyTax || ""}
                  onChange={handlePropertyTax}
                  placeholder="set Property Tax"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Home Insurance (yearly)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={mortgageData.homeInsurance || ""}
                  onChange={handleHomeInsurance}
                  placeholder="set Home Insurance"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PMI (%)
              </Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={mortgageData.pmi || ""}
                  onChange={handlePMI}
                  placeholder="set PMI"
                  step="0.01"
                  min="0"
                  max="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">%</span>
              </div>
            </div>

            {/* <div className="pt-2">
              <Button 
                onClick={handleCalculate}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
              >
                Calculate Mortgage
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Calculator Results Card */}
      <Card
        ref={ref}
        className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2"
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mortgage Summary</h3>

          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Monthly Mortgage Payment
                  </p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.monthlyPayment)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Principal + Interest
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Monthly Payment
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalMonthlyPayment)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Including taxes, insurance & PMI
                  </p>
                </div>
              </div>

              {/* Payment Breakdown Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">
                  Payment Breakdown
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          window.innerHeight >= 768
                            ? `${name}: ${(percent * 100).toFixed(0)}%`
                            : `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {paymentBreakdownData.map((entry, index) => (
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

              {/* Loan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Loan Amount
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.loanAmount)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Interest
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Cost
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalCost)}
                  </p>
                </div>
              </div>

              {/* Amortization Schedule */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold">
                    Amortization Schedule
                  </h4>
                  <button
                    className="text-primary-500 hover:text-primary-600 text-sm"
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
                          Year
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
                      {amortizationSchedule.map((year: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {year.year}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(year.principal)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(year.interest)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(year.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  className="mt-3 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center"
                  onClick={() =>
                    setViewFullamortizationSchedule((prev) => !prev)
                  }
                >
                  {viewFullamortizationSchedule
                    ? "Hide Full Amortization Schedule"
                    : "View Full Amortization Schedule"}
                  <i
                    className={`fas ml-1 text-xs transition-transform duration-200 ${
                      viewFullamortizationSchedule
                        ? "fa-chevron-up"
                        : "fa-chevron-right"
                    }`}
                  ></i>
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
