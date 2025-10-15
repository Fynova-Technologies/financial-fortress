import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import { HealthMeter } from "@/components/HealthMeter";
import { NetWorthChart } from "@/components/NetWorthChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Shield, Wallet, PiggyBank, Lightbulb, Bell, LineChart, FileText, ArrowRight } from "lucide-react";

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  monthlyDebtPayment: number;
  currentSavings: number;
  monthlySavings: number;
  retirementAge: number;
  retirementSavings: number;
  emergencyFundGoal: number;
  dti: number;
  savingsRate: number;
  emergencyFundMonths: number;
  netWorthGrowth: number;
}

interface QuizResult {
  classification: string;
  primary: string;
  secondary: string;
  scores: Record<string, number>;
  confidence: number;
  completedAt: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [, navigate] = useLocation();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    // Wait for auth to complete
    if (isLoading) return;

    // If not authenticated, redirect or show message
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting...');
      navigate('/');
      return;
    }

    // Load data from localStorage with user-specific keys
    const userId = user.sub;
    const storedFinancialData = localStorage.getItem(`financialData_${userId}`);
    const storedQuizResult = localStorage.getItem(`philosophyQuizResult_${userId}`);

    console.log('Loading dashboard data for user:', userId);
    console.log('Financial data found:', !!storedFinancialData);
    console.log('Quiz result found:', !!storedQuizResult);

    if (storedFinancialData) {
      try {
        const data = JSON.parse(storedFinancialData);
        setFinancialData(data);
        
        // Calculate health score based on multiple factors
        const score = calculateHealthScore(data);
        setHealthScore(score);
      } catch (error) {
        console.error('Error parsing financial data:', error);
      }
    } else {
      console.warn('No financial data found - user may need to complete onboarding');
      // Optionally redirect to onboarding
      // navigate('/onboarding');
    }

    if (storedQuizResult) {
      try {
        setQuizResult(JSON.parse(storedQuizResult));
      } catch (error) {
        console.error('Error parsing quiz result:', error);
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const calculateHealthScore = (data: FinancialData): number => {
    let score = 0;
    
    // Savings rate (0-30 points)
    if (data.savingsRate >= 20) score += 30;
    else if (data.savingsRate >= 15) score += 25;
    else if (data.savingsRate >= 10) score += 20;
    else if (data.savingsRate >= 5) score += 10;
    
    // DTI ratio (0-25 points)
    if (data.dti <= 15) score += 25;
    else if (data.dti <= 25) score += 20;
    else if (data.dti <= 35) score += 15;
    else if (data.dti <= 45) score += 10;
    
    // Emergency fund (0-25 points)
    if (data.emergencyFundMonths >= 6) score += 25;
    else if (data.emergencyFundMonths >= 4) score += 20;
    else if (data.emergencyFundMonths >= 2) score += 15;
    else if (data.emergencyFundMonths >= 1) score += 10;
    
    // Net worth growth (0-20 points)
    if (data.netWorthGrowth >= 10) score += 20;
    else if (data.netWorthGrowth >= 5) score += 15;
    else if (data.netWorthGrowth >= 2) score += 10;
    else if (data.netWorthGrowth > 0) score += 5;
    
    return Math.min(100, score);
  };

  const generateNetWorthData = (data: FinancialData) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentNetWorth = data.currentSavings - data.totalDebt;
    const monthlyGrowth = (currentNetWorth * data.netWorthGrowth) / 100 / 12;
    
    return months.map((month, index) => ({
      month,
      netWorth: currentNetWorth - (monthlyGrowth * (11 - index))
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while waiting for data
  if (!financialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
          <Button onClick={() => navigate('/onboarding')} variant="outline">
            Complete Onboarding
          </Button>
        </div>
      </div>
    );
  }

  const netWorth = financialData.currentSavings - financialData.totalDebt;
  
  const statCards = [
    {
      title: "Savings Rate",
      value: `${financialData.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "of monthly income",
    },
    {
      title: "Debt-to-Income",
      value: `${financialData.dti.toFixed(1)}%`,
      icon: TrendingDown,
      color: financialData.dti <= 36 ? "text-success" : "text-warning",
      bgColor: financialData.dti <= 36 ? "bg-success/10" : "bg-warning/10",
      description: "Below 36% is ideal",
    },
    {
      title: "Emergency Fund",
      value: `${financialData.emergencyFundMonths.toFixed(1)}mo`,
      icon: Shield,
      color: financialData.emergencyFundMonths >= 6 ? "text-success" : "text-warning",
      bgColor: financialData.emergencyFundMonths >= 6 ? "bg-success/10" : "bg-warning/10",
      description: "6 months recommended",
    },
    {
      title: "Current Net Worth",
      value: formatCurrency(netWorth),
      icon: DollarSign,
      color: netWorth >= 0 ? "text-success" : "text-destructive",
      bgColor: netWorth >= 0 ? "bg-success/10" : "bg-destructive/10",
      description: `${financialData.netWorthGrowth > 0 ? '+' : ''}${financialData.netWorthGrowth}% this year`,
    },
    {
      title: "Monthly Savings",
      value: formatCurrency(financialData.monthlySavings),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Added to savings",
    },
    {
      title: "Total Savings",
      value: formatCurrency(financialData.currentSavings),
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Available funds",
    },
  ];

  return (
      <div className="container mx-auto space-y-8">
                <div>
          <h1 className="text-3xl font-bold tracking-tight">Advisory Hub</h1>
          <p className="text-muted-foreground">
            Your complete financial health overview
          </p>
        </div>

        {/* Health Meter & Net Worth */}
        <div className="grid gap-6 md:grid-cols-2">
          <HealthMeter
            score={healthScore}
            description="Based on your savings rate, debt ratio, emergency fund, and net worth growth"
          />
          <NetWorthChart data={generateNetWorthData(financialData)} />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Financial Breakdown</CardTitle>
            <CardDescription>Detailed view of your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">{formatCurrency(financialData.monthlyIncome)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(financialData.monthlyExpenses)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Debt</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(financialData.totalDebt)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Monthly Debt Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(financialData.monthlyDebtPayment)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    // </div>
  );
}