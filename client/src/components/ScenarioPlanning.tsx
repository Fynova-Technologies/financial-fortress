import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Home, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Philosophy = "balanced" | "fire" | "yolo" | "conservative";

export default function ScenarioPlanning() {
  // Get philosophy from localStorage (set during onboarding)
  const [philosophy, setPhilosophy] = useState<Philosophy>(() => {
    const savedPhilosophy = localStorage.getItem("userPhilosophy");
    return (savedPhilosophy as Philosophy) || "balanced";
  });

  // Rent vs Buy state
  const [rentPrice, setRentPrice] = useState("1500");
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [years, setYears] = useState("30");

  // Invest vs Spend state
  const [investAmount, setInvestAmount] = useState("10000");
  const [investReturn, setInvestReturn] = useState("7");
  const [investYears, setInvestYears] = useState("20");

  // Retirement state
  const [currentAge, setCurrentAge] = useState("30");
  const [retireAge, setRetireAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContribution, setMonthlyContribution] = useState("1000");
  const [expectedReturn, setExpectedReturn] = useState("7");

  // Rent vs Buy calculations
  const calculateRentVsBuy = () => {
    const monthlyRent = Number(rentPrice) || 0;
    const price = Number(homePrice) || 0;
    const down = Number(downPayment) || 0;
    const rate = Number(mortgageRate) / 100 / 12 || 0;
    const n = Number(years) * 12 || 1;
    const principal = price - down;
    
    // Handle edge case when rate is 0
    let monthlyMortgage = 0;
    if (rate === 0) {
      monthlyMortgage = principal / n;
    } else {
      monthlyMortgage = principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    }
    
    const propertyTax = price * 0.012 / 12;
    const insurance = price * 0.005 / 12;
    const maintenance = price * 0.01 / 12;
    const totalMonthlyOwn = monthlyMortgage + propertyTax + insurance + maintenance;
    
    const costDifference = totalMonthlyOwn - monthlyRent;
    const breakEvenMonths = costDifference !== 0 ? down / costDifference : 0;
    const breakEvenYears = Math.abs(breakEvenMonths) / 12;
    
    return {
      monthlyRent,
      monthlyMortgage: isFinite(monthlyMortgage) ? monthlyMortgage.toFixed(0) : "0",
      totalMonthlyOwn: isFinite(totalMonthlyOwn) ? totalMonthlyOwn.toFixed(0) : "0",
      breakEvenYears: isFinite(breakEvenYears) ? breakEvenYears.toFixed(1) : "0",
      totalInterest: isFinite(monthlyMortgage * n - principal) ? (monthlyMortgage * n - principal).toFixed(0) : "0",
      recommendation: breakEvenYears < 5 ? "buy" : breakEvenYears < 10 ? "depends" : "rent"
    };
  };

  // Invest vs Spend calculations
  const calculateInvestGrowth = () => {
    const principal = Number(investAmount);
    const rate = Number(investReturn) / 100;
    const time = Number(investYears);
    
    const futureValue = principal * Math.pow(1 + rate, time);
    const gains = futureValue - principal;
    
    const data = [];
    for (let year = 0; year <= time; year++) {
      const value = principal * Math.pow(1 + rate, year);
      data.push({ year, value: Math.round(value) });
    }
    
    return { futureValue, gains, data };
  };

  // Retirement calculations
  const calculateRetirement = () => {
    const age = Number(currentAge);
    const retire = Number(retireAge);
    const savings = Number(currentSavings);
    const monthly = Number(monthlyContribution);
    const rate = Number(expectedReturn) / 100 / 12;
    const yearsToRetire = retire - age;
    const months = yearsToRetire * 12;
    
    // Future value of current savings
    const fvSavings = savings * Math.pow(1 + rate, months);
    
    // Future value of monthly contributions
    const fvContributions = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    
    const totalAtRetirement = fvSavings + fvContributions;
    
    // 4% withdrawal rule for annual retirement income
    const annualIncome = totalAtRetirement * 0.04;
    
    const data = [];
    for (let year = 0; year <= yearsToRetire; year++) {
      const monthsElapsed = year * 12;
      const fvS = savings * Math.pow(1 + rate, monthsElapsed);
      const fvC = monthly * ((Math.pow(1 + rate, monthsElapsed) - 1) / rate);
      data.push({ 
        age: age + year, 
        value: Math.round(fvS + fvC) 
      });
    }
    
    return { totalAtRetirement, annualIncome, yearsToRetire, data };
  };

  const rentVsBuy = calculateRentVsBuy();
  const investGrowth = calculateInvestGrowth();
  const retirement = calculateRetirement();

  const philosophyAdvice = {
    balanced: "Consider all options carefully, weighing short-term flexibility against long-term gains",
    fire: "Maximize savings and investments; prioritize buying only if it accelerates your path to FI",
    yolo: "Choose what brings you joy now, but maintain a safety cushion for the future",
    conservative: "Prioritize stability and proven strategies; avoid high-risk scenarios"
  };

  return (
      <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Scenario Planning</h1>
        <p className="text-muted-foreground">
          Compare options and model your financial future
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="philosophy">Your Philosophy:</Label>
        <div className="font-semibold capitalize">{philosophy}</div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {philosophyAdvice[philosophy]}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="rentbuy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rentbuy">Rent vs Buy</TabsTrigger>
          <TabsTrigger value="investspend">Invest vs Spend</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
        </TabsList>

        <TabsContent value="rentbuy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Rent vs Buy Analysis
              </CardTitle>
              <CardDescription>
                Compare the financial impact of renting versus buying a home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="rent-price">Monthly Rent ($)</Label>
                  <Input
                    id="rent-price"
                    type="number"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home-price">Home Price ($)</Label>
                  <Input
                    id="home-price"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Down Payment ($)</Label>
                  <Input
                    id="down-payment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgage-rate">Mortgage Rate (%)</Label>
                  <Input
                    id="mortgage-rate"
                    type="number"
                    step="0.1"
                    value={mortgageRate}
                    onChange={(e) => setMortgageRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Loan Term (years)</Label>
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="text-lg font-semibold">Comparison Results</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-2xl font-bold">${rentVsBuy.monthlyRent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Mortgage</p>
                    <p className="text-2xl font-bold">${rentVsBuy.monthlyMortgage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Monthly (Own)</p>
                    <p className="text-2xl font-bold text-primary">${rentVsBuy.totalMonthlyOwn}</p>
                    <p className="text-xs text-muted-foreground">Includes taxes, insurance, maintenance</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Break-even Point:</span>
                    <span className="font-bold">{rentVsBuy.breakEvenYears} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Interest Paid:</span>
                    <span className="font-bold">${Number(rentVsBuy.totalInterest).toLocaleString()}</span>
                  </div>
                </div>

                {rentVsBuy.recommendation === "buy" && (
                  <Alert className="bg-success/10 border-success">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <AlertDescription>
                      <strong>Recommendation: Buy</strong> - Break-even in under 5 years. Buying is financially advantageous if you plan to stay long-term.
                    </AlertDescription>
                  </Alert>
                )}
                {rentVsBuy.recommendation === "depends" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendation: Depends</strong> - Break-even in 5-10 years. Consider your lifestyle, mobility needs, and market conditions.
                    </AlertDescription>
                  </Alert>
                )}
                {rentVsBuy.recommendation === "rent" && (
                  <Alert className="bg-warning/10 border-warning">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <AlertDescription>
                      <strong>Recommendation: Rent</strong> - Break-even over 10 years. Renting may be more flexible and cost-effective in the near term.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investspend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Invest vs Spend Analysis
              </CardTitle>
              <CardDescription>
                See the long-term impact of investing versus spending money today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="invest-amount">Amount ($)</Label>
                  <Input
                    id="invest-amount"
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invest-return">Expected Return (%)</Label>
                  <Input
                    id="invest-return"
                    type="number"
                    step="0.1"
                    value={investReturn}
                    onChange={(e) => setInvestReturn(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invest-years">Time Horizon (years)</Label>
                  <Input
                    id="invest-years"
                    type="number"
                    value={investYears}
                    onChange={(e) => setInvestYears(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="text-lg font-semibold">Investment Growth Projection</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Future Value</p>
                    <p className="text-3xl font-bold text-success">${Math.round(investGrowth.futureValue).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Gains</p>
                    <p className="text-3xl font-bold text-primary">${Math.round(investGrowth.gains).toLocaleString()}</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={investGrowth.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} name="Portfolio Value" />
                  </LineChart>
                </ResponsiveContainer>

                <Alert className="bg-primary/10 border-primary">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    By investing ${investAmount} instead of spending it, you could have <strong>${Math.round(investGrowth.futureValue).toLocaleString()}</strong> in {investYears} years - that's <strong>{((investGrowth.futureValue / Number(investAmount) - 1) * 100).toFixed(0)}%</strong> growth!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Retirement Planning
              </CardTitle>
              <CardDescription>
                Model different retirement ages and savings scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="current-age">Current Age</Label>
                  <Input
                    id="current-age"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retire-age">Retirement Age</Label>
                  <Input
                    id="retire-age"
                    type="number"
                    value={retireAge}
                    onChange={(e) => setRetireAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-savings">Current Savings ($)</Label>
                  <Input
                    id="current-savings"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
                  <Input
                    id="monthly-contribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-return">Expected Return (%)</Label>
                  <Input
                    id="expected-return"
                    type="number"
                    step="0.1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="text-lg font-semibold">Retirement Projection</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Years to Retirement</p>
                    <p className="text-3xl font-bold">{retirement.yearsToRetire}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total at Retirement</p>
                    <p className="text-3xl font-bold text-success">${Math.round(retirement.totalAtRetirement).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Income (4% rule)</p>
                    <p className="text-3xl font-bold text-primary">${Math.round(retirement.annualIncome).toLocaleString()}</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={retirement.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} name="Portfolio Value" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="space-y-2 pt-4 border-t">
                  {retirement.annualIncome < 40000 && (
                    <Alert className="bg-warning/10 border-warning">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <AlertDescription>
                        Your projected annual income may be below comfortable retirement levels. Consider increasing contributions or delaying retirement.
                      </AlertDescription>
                    </Alert>
                  )}
                  {retirement.annualIncome >= 40000 && retirement.annualIncome < 80000 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You're on track for a modest retirement. Consider increasing contributions for more comfort.
                      </AlertDescription>
                    </Alert>
                  )}
                  {retirement.annualIncome >= 80000 && (
                    <Alert className="bg-success/10 border-success">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <AlertDescription>
                        Excellent! You're on track for a comfortable retirement. {retirement.yearsToRetire < 25 && "Consider retiring even earlier!"}
                      </AlertDescription>
                    </Alert>
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
