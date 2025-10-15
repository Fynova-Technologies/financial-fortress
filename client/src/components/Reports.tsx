import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, Target } from "lucide-react";

type TimePeriod = "monthly" | "quarterly" | "yearly";

export default function Reports() {
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [whatIfIncome, setWhatIfIncome] = useState("5000");
  const [whatIfExpenses, setWhatIfExpenses] = useState("3500");

  // Mock data for reports
  const spendingData = [
    { category: "Housing", amount: 1200, color: "#0EA5E9" },
    { category: "Food", amount: 600, color: "#8B5CF6" },
    { category: "Transport", amount: 400, color: "#EC4899" },
    { category: "Entertainment", amount: 300, color: "#F59E0B" },
    { category: "Utilities", amount: 200, color: "#10B981" },
    { category: "Other", amount: 800, color: "#6366F1" },
  ];

  const cashflowData = [
    { month: "Jan", income: 5000, expenses: 3500 },
    { month: "Feb", income: 5200, expenses: 3600 },
    { month: "Mar", income: 5100, expenses: 3800 },
    { month: "Apr", income: 5300, expenses: 3400 },
    { month: "May", income: 5000, expenses: 3700 },
    { month: "Jun", income: 5400, expenses: 3500 },
  ];

  const netWorthData = [
    { month: "Jan", assets: 50000, liabilities: 25000 },
    { month: "Feb", assets: 52000, liabilities: 24500 },
    { month: "Mar", assets: 53500, liabilities: 24000 },
    { month: "Apr", assets: 55000, liabilities: 23500 },
    { month: "May", assets: 56500, liabilities: 23000 },
    { month: "Jun", assets: 58000, liabilities: 22500 },
  ];

  const investmentData = [
    { name: "Stocks", value: 25000, roi: 8.5 },
    { name: "Bonds", value: 15000, roi: 4.2 },
    { name: "Real Estate", value: 10000, roi: 6.8 },
    { name: "Crypto", value: 5000, roi: 12.3 },
  ];

  const debtData = [
    { type: "Mortgage", balance: 180000, rate: 3.5, payment: 1200 },
    { type: "Car Loan", balance: 15000, rate: 4.2, payment: 450 },
    { type: "Credit Card", balance: 3500, rate: 18.9, payment: 150 },
  ];

  const totalIncome = cashflowData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = cashflowData.reduce((sum, d) => sum + d.expenses, 0);
  const avgNetCashflow = (totalIncome - totalExpenses) / cashflowData.length;

  const currentNetWorth = netWorthData[netWorthData.length - 1].assets - netWorthData[netWorthData.length - 1].liabilities;
  const netWorthChange = currentNetWorth - (netWorthData[0].assets - netWorthData[0].liabilities);

  const totalInvestments = investmentData.reduce((sum, inv) => sum + inv.value, 0);
  const avgROI = investmentData.reduce((sum, inv) => sum + inv.roi * inv.value, 0) / totalInvestments;

  const totalDebt = debtData.reduce((sum, d) => sum + d.balance, 0);
  const totalMonthlyPayments = debtData.reduce((sum, d) => sum + d.payment, 0);

  // What-if calculations
  const whatIfSavings = Number(whatIfIncome) - Number(whatIfExpenses);
  const whatIfSavingsRate = (whatIfSavings / Number(whatIfIncome)) * 100;
  const whatIfYearlySavings = whatIfSavings * 12;

  return (
      <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Reports & Insights</h1>
        <p className="text-muted-foreground">
          Comprehensive financial reports and what-if analysis
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="period">Report Period:</Label>
        <Select value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <SelectTrigger id="period" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
          <TabsTrigger value="whatif">What-If</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Cashflow</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${avgNetCashflow.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {avgNetCashflow > 0 ? "Positive" : "Negative"} monthly avg
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentNetWorth.toLocaleString()}</div>
                <p className="text-xs text-success mt-1">
                  +${netWorthChange.toLocaleString()} this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInvestments.toLocaleString()}</div>
                <p className="text-xs text-success mt-1">
                  {avgROI.toFixed(1)}% avg ROI
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${totalMonthlyPayments}/mo payments
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Net worth increased by {((netWorthChange / (netWorthData[0].assets - netWorthData[0].liabilities)) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">You're on track with your financial goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Savings rate: {((avgNetCashflow / (totalIncome / cashflowData.length)) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Consider increasing to 20% for optimal growth</p>
                </div>
              </div>
              {debtData.some(d => d.rate > 10) && (
                <div className="flex items-start gap-3">
                  <TrendingDown className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium">High-interest debt detected</p>
                    <p className="text-sm text-muted-foreground">Priority: Pay off credit cards (18.9% APR) first</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>Total: ${spendingData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {spendingData.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.category}</span>
                      </div>
                      <span className="font-semibold">${item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>6-month cashflow trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networth">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Net Worth Trend</CardTitle>
                <CardDescription>Assets minus liabilities over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={netWorthData.map(d => ({ ...d, netWorth: d.assets - d.liabilities }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="netWorth" stroke="#8B5CF6" strokeWidth={2} name="Net Worth" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Current allocation and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentData.map((inv) => (
                    <div key={inv.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{inv.name}</span>
                        <span className="text-sm text-success">+{inv.roi}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(inv.value / totalInvestments) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">${inv.value.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatif" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Analysis</CardTitle>
              <CardDescription>Model different financial scenarios to see potential outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatif-income">Monthly Income</Label>
                  <Input
                    id="whatif-income"
                    type="number"
                    value={whatIfIncome}
                    onChange={(e) => setWhatIfIncome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatif-expenses">Monthly Expenses</Label>
                  <Input
                    id="whatif-expenses"
                    type="number"
                    value={whatIfExpenses}
                    onChange={(e) => setWhatIfExpenses(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-lg">Projected Outcomes</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Savings</p>
                    <p className="text-2xl font-bold text-success">${whatIfSavings.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Savings Rate</p>
                    <p className="text-2xl font-bold">{whatIfSavingsRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yearly Savings</p>
                    <p className="text-2xl font-bold">${whatIfYearlySavings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Insights & Recommendations</h3>
                <div className="space-y-2">
                  {whatIfSavingsRate < 10 && (
                    <p className="text-sm text-destructive">⚠️ Savings rate below 10% - Consider reducing expenses or increasing income</p>
                  )}
                  {whatIfSavingsRate >= 10 && whatIfSavingsRate < 20 && (
                    <p className="text-sm text-warning">💡 Good start! Aim for 20% savings rate for optimal financial health</p>
                  )}
                  {whatIfSavingsRate >= 20 && (
                    <p className="text-sm text-success">✅ Excellent savings rate! You're on track for financial independence</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    At this rate, you could save ${(whatIfYearlySavings * 5).toLocaleString()} in 5 years
                  </p>
                  {whatIfYearlySavings > 25000 && (
                    <p className="text-sm text-primary">
                      💎 Consider maxing out retirement accounts (IRA: $7,000, 401k: $23,000)
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  );
}
