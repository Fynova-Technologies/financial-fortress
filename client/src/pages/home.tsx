import { useCalculator } from "@/store/calculator-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { routes } from "@/types";
import { useState } from "react";

export default function Home() {
  const [location, setLocation] = useLocation();
  const { budgetData, calculateMortgage, calculateRetirement } = useCalculator();
  const [viewAllActivity, setViewAllActivity] = useState(false);

  // Quick access calculators
  const quickAccessCalculators = [
    { 
      id: "budget-planner", 
      label: "Budget Planner", 
      icon: "fa-wallet", 
      iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", 
      description: "Manage your monthly budget",
      path: "/budget-planner"
    },
    { 
      id: "mortgage-calculator", 
      label: "Mortgage Calculator", 
      icon: "fa-home", 
      iconBg: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", 
      description: "Calculate home loan payments",
      path: "/mortgage-calculator"
    },
    { 
      id: "emi-calculator", 
      label: "EMI Calculator", 
      icon: "fa-calculator", 
      iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", 
      description: "Calculate loan payments",
      path: "/emi-calculator"
    },
    { 
      id: "retirement-planner", 
      label: "Retirement Planner", 
      icon: "fa-chart-line", 
      iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", 
      description: "Plan your retirement",
      path: "/retirement-planner"
    },
    { 
      id: "roi-calculator", 
      label: "ROI Calculator", 
      icon: "fa-chart-pie", 
      iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400", 
      description: "Calculate investment returns",
      path: "/roi-calculator"
    },
    { 
      id: "currency-converter", 
      label: "Currency Converter", 
      icon: "fa-exchange-alt", 
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", 
      description: "Convert between currencies",
      path: "/currency-converter"
    },
  ];

  // Recent activity data (static for now)
  const recentActivity = [
    {
      date: "Today, 2:30 PM",
      calculator: "Budget Planner",
      action: "Created new budget",
      result: "Saved Successfully",
      resultClass: "text-success"
    },
    {
      date: "Yesterday",
      calculator: "Mortgage Calculator",
      action: "Calculated 30-year fixed rate",
      result: "$1,250/month",
      resultClass: "text-primary-500"
    },
    {
      date: "Jul 15, 2023",
      calculator: "Retirement Planner",
      action: "Updated retirement goal",
      result: "Goal Updated",
      resultClass: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Welcome Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-3">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl font-bold mb-2">Welcome to FinCalc Pro</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your comprehensive financial planning toolkit. Get started with any of our calculators to take control of your finances.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setLocation("/budget-planner")}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Budget Planner
                </Button>
                <Button 
                  onClick={() => setLocation("/mortgage-calculator")}
                  variant="outline"
                  className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800 border-0"
                >
                  Mortgage Calculator
                </Button>
                <Button 
                  onClick={() => setLocation("/retirement-planner")}
                  variant="outline"
                  className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800 border-0"
                >
                  Retirement Planner
                </Button>
              </div>
            </div>
            {/* Financial dashboard illustration */}
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
              alt="Financial dashboard overview" 
              className="rounded-lg shadow h-40 w-auto md:h-32 lg:h-40 object-cover" 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Calculator Shortcuts */}
      {quickAccessCalculators.map((calc) => (
        <Card 
          key={calc.id}
          className="calculator-card bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer"
          onClick={() => setLocation(calc.path)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold mb-1">{calc.label}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{calc.description}</p>
                <Link href={calc.path} className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center">
                  Open Calculator
                  <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </Link>
              </div>
              <div className={`text-xl rounded-full w-10 h-10 flex items-center justify-center ${calc.iconBg}`}>
                <i className={`fas ${calc.icon}`}></i>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Recent Activity Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-3">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calculator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.calculator}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.action}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${activity.resultClass}`}>{activity.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button 
            variant="link"
            className="mt-4 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 px-0 text-sm flex items-center"
            onClick={() => setViewAllActivity(prev => !prev)}
          >
            View All Activity
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
