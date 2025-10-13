import {Layout} from '@/components/Layout';

export default function Calculators () {
    return (
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Financial Calculators</h1>
          <Layout>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">

            {/* Budget Planner Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Budget Planner</h2>
              <p className="text-gray-600 mb-4">Create and manage your monthly budget.</p>
              <a
                href="/budget-planner"
                className="text-blue-600 hover:underline"
              >
                Go to Budget Planner
              </a>
            </div>
    
            {/* Mortgage Calculator Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Mortgage Calculator</h2>
              <p className="text-gray-600 mb-4">Calculate your mortgage payments.</p>
              <a
                href="/mortgage-calculator"
                className="text-blue-600 hover:underline"
              >
                Go to Mortgage Calculator
              </a>
            </div>
    
            {/* EMI Calculator Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">EMI Calculator</h2>
              <p className="text-gray-600 mb-4">Calculate your loan EMI payments.</p>
              <a
                href="/emi-calculator"
                className="text-blue-600 hover:underline"
              >
                Go to EMI Calculator
              </a>
            </div>
    
            {/* Retirement Planner Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Retirement Planner</h2>
              <p className="text-gray-600 mb-4">Plan for your retirement goals.</p>
              <a
                href="/retirement-planner"
                className="text-blue-600 hover:underline"
              >
                Go to Retirement Planner
              </a>
            </div>
    
            {/* Salary Manager Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Salary Manager</h2>
              <p className="text-gray-600 mb-4">Analyze your salary and taxes.</p>
              <a
                href="/salary-manager"
                className="text-blue-600 hover:underline"
              >
                Go to Salary Manager
              </a>
            </div>
            {/* ROI Calculator Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">ROI Calculator</h2>
              <p className="text-gray-600 mb-4">Calculate your investment returns.</p>
              <a
                href="/roi-calculator"
                className="text-blue-600 hover:underline"
              >
                Go to ROI Calculator
              </a>
            </div>
            {/* Currency Converter Card */}
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Currency Converter</h2>
              <p className="text-gray-600 mb-4">Convert between different currencies.</p>
              <a
                href="/currency-converter"
                className="text-blue-600 hover:underline"
              >
                Go to Currency Converter
              </a>
            </div>
            </div>
            </Layout>
        </div>
    );
}

