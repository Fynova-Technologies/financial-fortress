import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

function getProjectionChartData(results: any = {}) {
  if (!results?.chartData) return [];
  const chartData = results.chartData.filter((_: any, i: number) => i % 3 === 0);
  return chartData.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    ...d.goals.reduce((acc: any, g: any) => { acc[g.name] = g.amount; return acc; }, {})
  }));
}

export default function Projections({ savingsData, results, onAdd }: any) {
  const chartData = getProjectionChartData(results);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Savings Projections</h3>

        {results?.goalResults?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p>Total Saved</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalSaved)}</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <p>Total Target</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalTarget)}</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <p>Overall Progress</p>
                <p className="text-2xl font-bold">{results.totalTarget > 0 ? ((results.totalSaved / results.totalTarget) * 100).toFixed(0) : 0}%</p>
              </div>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}K` : `${value}`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  {savingsData?.savingsGoals?.map((goal: any, idx: number) => (
                    <Line key={goal.id} type="monotone" dataKey={goal.name} stroke={`hsl(var(--chart-${(idx%5)+1}))`} activeDot={{ r: 8 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {results.totalMonthlyNeeded > 0 && <li>Total monthly needed: {formatCurrency(results.totalMonthlyNeeded)}</li>}
                <li>Automate your savings to make steady progress.</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <h4>No Data to Display</h4>
            <p>Add a savings goal to see projections.</p>
            <button onClick={onAdd} className="mt-3 btn-primary">Add Your First Goal</button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
