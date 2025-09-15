import { useEffect, useState } from "react";
import { useCalculator } from "@/store/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatPercentage } from "@/lib/utils";
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
  AreaChart,
  Area
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ROICalculator = (() => {
  const { roiData, updateROIData, calculateROI } = useCalculator();
  const [results, setResults] = useState<any>(null);

  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchROIData = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("access token granted ROI: ", token);

        const res = await fetch("https://financial-fortress.onrender.com/api/roi-calculations", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        // Parse JSON — this is an array of records
        const allCalculations: Array<{
          initialInvestment: number;
          additionalContribution: number;
          contributionFrequency: 'monthly' | 'quarterly' | 'annual';
          annualRate: number;
          compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
          investmentTerm: number;
          createdAt: string;
        }> = await res.json();

        if ( allCalculations.length === 0) {
          return;
        }
        const latest = allCalculations.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );

        updateROIData({
          initialInvestment: latest.initialInvestment,
          additionalContribution: latest.additionalContribution,
          contributionFrequency: latest.contributionFrequency,
          annualRate: latest.annualRate,
          compoundingFrequency: latest.compoundingFrequency,
          investmentTerm: latest.investmentTerm,
        });
        
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }

    if(user){
      fetchROIData();
    }
  }, [getAccessTokenSilently, user]);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [roiData]);

  const handleCalculate = () => {
    const calculationResults = calculateROI();
    setResults(calculationResults);
  };

  const handleInputChange = (field: string, value: number | string) => {
    if (field === 'contributionFrequency' || field === 'compoundingFrequency') {
      updateROIData({ [field]: value });
    } else {
      updateROIData({ [field]: typeof value === 'string' ? 0 : value });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Investment Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Investment ($)</Label>
              <Input 
                type="number" 
                value={roiData.initialInvestment || ""} 
                onChange={(e) => handleInputChange('initialInvestment', parseFloat(e.target.value) || 0)}
                placeholder="10,000"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Contribution</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={roiData.additionalContribution || ""} 
                  onChange={(e) => handleInputChange('additionalContribution', parseFloat(e.target.value) || 0)}
                  placeholder="500"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">$</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Frequency</Label>
              <Select 
                value={roiData.contributionFrequency} 
                onValueChange={(value) => handleInputChange('contributionFrequency', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={roiData.contributionFrequency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Rate of Return (%)</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={roiData.annualRate || ""} 
                  onChange={(e) => handleInputChange('annualRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="30"
                  step="0.1"
                  placeholder="8"
                  className="w-full"
                />
                <span className="text-gray-600 dark:text-gray-400 ml-2">%</span>
              </div>
              <div className="mt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.1" 
                  value={roiData.annualRate || 0}
                  onChange={(e) => handleInputChange('annualRate', parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compounding Frequency</Label>
              <Select 
                value={roiData.compoundingFrequency} 
                onValueChange={(value) => handleInputChange('compoundingFrequency', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={roiData.compoundingFrequency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investment Term (Years)</Label>
              <Input 
                type="number" 
                value={roiData.investmentTerm || ""} 
                onChange={(e) => handleInputChange('investmentTerm', parseInt(e.target.value) || 0)}
                min="1"
                max="50"
                placeholder="10"
                className="w-full"
              />
              <div className="mt-2">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  step="1" 
                  value={roiData.investmentTerm || 0}
                  onChange={(e) => handleInputChange('investmentTerm', parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* <div className="pt-2">
              <Button 
                onClick={handleCalculate}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
              >
                Calculate ROI
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>
      
      {/* Results Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Investment Growth Summary</h3>
          
          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Final Investment Value</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(results.finalValue)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interest Earned</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(results.interestEarned)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Return on Investment (ROI)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPercentage(results.roi)}
                  </p>
                </div>
              </div>
              
              {/* Growth Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Investment Growth Over Time</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={results.chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
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
                        dataKey="amount" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1) / 0.2)" 
                        name="Investment Value" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Contribution Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Initial Investment</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(roiData.initialInvestment)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {((roiData.initialInvestment / results.totalContributions) * 100).toFixed(1)}% of total contributions
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additional Contributions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.totalAdditionalContributions)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {((results.totalAdditionalContributions / results.totalContributions) * 100).toFixed(1)}% of total contributions
                  </p>
                </div>
              </div>
              
              {/* Tips and Notes */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Investment Tips</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Starting early and regular contributions significantly impact your final investment value.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Consider diversifying your investments to manage risk while seeking growth.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Review and adjust your investment strategy periodically to stay on track with your goals.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
})
