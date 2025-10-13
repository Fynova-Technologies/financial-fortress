import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Layout } from "@/components/Layout";
import { HealthMeter } from "@/components/HealthMeter";
import { NetWorthChart } from "@/components/NetWorthChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Shield } from "lucide-react";
import { mockApiResponses } from "@/lib/api-client";

export default function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [metrics, setMetrics] = useState(mockApiResponses.financialHealth);
  const [netWorthData, setNetWorthData] = useState(mockApiResponses.netWorthHistory);

  useEffect(() => {
    // In production, fetch real data using the API client
    // const loadData = async () => {
    //   const token = await getAccessTokenSilently();
    //   const health = await apiClient.getFinancialHealth(token);
    //   const history = await apiClient.getNetWorthHistory(token);
    //   setMetrics(health);
    //   setNetWorthData(history);
    // };
    // loadData();
  }, [getAccessTokenSilently]);

  const statCards = [
    {
      title: "Savings Rate",
      value: `${metrics.savingsRate}%`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "of monthly income",
    },
    {
      title: "Debt-to-Income",
      value: `${metrics.debtToIncome}%`,
      icon: TrendingDown,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Below 36% is ideal",
    },
    {
      title: "Emergency Fund",
      value: `${metrics.emergencyFundMonths}mo`,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "6 months recommended",
    },
    {
      title: "Current Net Worth",
      value: "$58,000",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "+$13K this year",
    },
  ];

  return (
    // <Layout>
      <div className="container mx-auto space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial health at a glance</p>
        </div>

        {/* Health Meter */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HealthMeter
              score={metrics.healthScore}
              description="Based on savings rate, debt ratio, and emergency fund"
            />
          </div>

          <div className="grid gap-4">
            {statCards.slice(0, 2).map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {statCards.slice(2).map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Net Worth Chart */}
        <NetWorthChart data={netWorthData} />
      </div>
    // </Layout>x
  );
}
