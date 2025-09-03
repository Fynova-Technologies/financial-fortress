import { useEffect, useState } from "react";
import { useCalculator } from "@/store/Calculator/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

export const RetirementPlanner = (() => {
  const { retirementData, updateRetirementData, calculateRetirement } = useCalculator();
  const [results, setResults] = useState<any>(null);
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchRetirementData = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("access token granted Retirement Planner: ", token);

        const res = await fetch("https://financial-fortress.onrender.com/api/retirement-calculations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error("Failed to fetch retirement data");
        }

        const allCalculations: Array<{
          currentAge: number;
          retirementAge: number;
          lifeExpectancy: number;
          currentSavings: number;
          monthlyContribution: number;
          expectedReturn: number;
          inflationRate: number;
          desiredMonthlyIncome: number;
          createdAt: string;
        }> = await res.json();

        if (allCalculations.length === 0) return;
        const latest = allCalculations.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b 
        );

        updateRetirementData({
          currentAge: latest.currentAge,
          retirementAge: latest.retirementAge,
          lifeExpectancy: latest.lifeExpectancy,
          currentSavings: latest.currentSavings,
          monthlyContribution: latest.monthlyContribution,
          expectedReturn: latest.expectedReturn,
          inflationRate: latest.inflationRate,
          desiredMonthlyIncome: latest.desiredMonthlyIncome,
        });

      } catch (error) {
        console.error("Error fetching retirement data:", error);
      }
    };

    if(user){
      fetchRetirementData();
    }
  }, [getAccessTokenSilently, user]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [retirementData]);

  const handleCalculate = () => {
    const calculationResults = calculateRetirement();
    setResults(calculationResults);
  };

  const handleInputChange = (field: string, value: number) => {
    updateRetirementData({ [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Retirement Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Age</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.currentAge || ""} 
                  onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value) || 0)}
                  min="18"
                  max="80"
                  placeholder="30"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">years</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retirement Age</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.retirementAge || ""} 
                  onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value) || 0)}
                  min="50"
                  max="90"
                  placeholder="65"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">years</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Life Expectancy</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.lifeExpectancy || ""} 
                  onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value) || 0)}
                  min="70"
                  max="120"
                  placeholder="90"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">years</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Savings</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.currentSavings || ""} 
                  onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value) || 0)}
                  placeholder="50,000"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Contribution</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.monthlyContribution || ""} 
                  onChange={(e) => handleInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                  placeholder="500"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Annual Return (%)</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.expectedReturn || ""} 
                  onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value) || 0)}
                  min="1"
                  max="15"
                  step="0.1"
                  placeholder="7"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">%</span>
              </div>
              <div className="mt-2">
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  step="0.1" 
                  value={retirementData.expectedReturn || 0}
                  onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inflation Rate (%)</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.inflationRate || ""} 
                  onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="2.5"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">%</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desired Monthly Income (during retirement)</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={retirementData.desiredMonthlyIncome || ""} 
                  onChange={(e) => handleInputChange('desiredMonthlyIncome', parseFloat(e.target.value) || 0)}
                  placeholder="5,000"
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
                Calculate Retirement Plan
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>
      
      {/* Results Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Retirement Projection</h3>
          
          {results && (
            <>
              {/* Projection Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projected Retirement Savings</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.projectedSavings)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Years Until Retirement</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.yearsUntilRetirement}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Income in Retirement</p>
                  <p className={`text-2xl font-bold ${results.isGoalMet ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(results.projectedMonthlyIncome)}
                  </p>
                </div>
              </div>
              
              {/* Retirement Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Retirement Growth Projection</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={results.chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
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
                      <Area 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1) / 0.2)" 
                        name="Projected Savings" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Goal Status */}
              <div className={`mb-6 p-4 rounded-lg ${
                results.isGoalMet 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <i className={`fas text-xl ${
                      results.isGoalMet 
                        ? 'fa-check-circle text-success' 
                        : 'fa-exclamation-circle text-error'
                    }`}></i>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      results.isGoalMet ? 'text-success' : 'text-error'
                    }`}>
                      {results.isGoalMet ? 'You\'re on track for retirement!' : 'Retirement gap detected'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {results.goalSummary}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h4 className="text-md font-semibold mb-3">Action Steps</h4>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-angle-right mt-1 mr-2 text-primary-500"></i>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
})
