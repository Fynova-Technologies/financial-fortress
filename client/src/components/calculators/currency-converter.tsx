import { useEffect, useState } from "react";
import { useCalculator } from "@/store/calculator-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

export function CurrencyConverter() {
  const { currencyData, updateCurrencyData, convertCurrency } = useCalculator();
  const [results, setResults] = useState<any>(null);

  // Calculate on first load and when inputs change
  useEffect(() => {
    handleConvert();
  }, [currencyData]);

  const handleConvert = () => {
    const conversionResults = convertCurrency();
    setResults(conversionResults);
  };

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrencyData({ amount: parseFloat(e.target.value) || 0 });
  };

  const handleFromCurrency = (value: string) => {
    updateCurrencyData({ fromCurrency: value });
  };

  const handleToCurrency = (value: string) => {
    updateCurrencyData({ toCurrency: value });
  };

  const getSymbolByCurrency = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };

  // Format date for chart display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    updateCurrencyData({
      fromCurrency: currencyData.toCurrency,
      toCurrency: currencyData.fromCurrency
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Inputs Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Currency Converter</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</Label>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-400 mr-2">
                  {getSymbolByCurrency(currencyData.fromCurrency)}
                </span>
                <Input 
                  type="number" 
                  value={currencyData.amount || ""} 
                  onChange={handleAmount}
                  placeholder="1000"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</Label>
              <Select 
                value={currencyData.fromCurrency} 
                onValueChange={handleFromCurrency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currencyData.fromCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Swap button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleSwapCurrencies}
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                <i className="fas fa-exchange-alt"></i>
              </Button>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</Label>
              <Select 
                value={currencyData.toCurrency} 
                onValueChange={handleToCurrency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currencyData.toCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleConvert}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
              >
                Convert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Result</h3>
          
          {results && !results.error && (
            <>
              <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatNumber(currencyData.amount)} {currencyData.fromCurrency}
                    </p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {getSymbolByCurrency(currencyData.toCurrency)} {formatNumber(results.convertedAmount, 2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      1 {currencyData.fromCurrency} = {getSymbolByCurrency(currencyData.toCurrency)} {formatNumber(results.exchangeRate, 4)} {currencyData.toCurrency}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-2xl mr-3">
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Exchange Rate</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {formatNumber(results.exchangeRate, 4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rate History Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Exchange Rate History (Last 30 Days)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => formatNumber(value, 4)}
                      />
                      <Tooltip 
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        formatter={(value: number) => [formatNumber(value, 4), 'Exchange Rate']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="hsl(var(--chart-1))" 
                        name={`${currencyData.fromCurrency} to ${currencyData.toCurrency}`} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Common Conversions */}
              <div>
                <h4 className="text-md font-semibold mb-3">Common Conversions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[10, 100, 1000, 10000].map(amount => (
                    <div key={amount} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(amount)} {currencyData.fromCurrency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getSymbolByCurrency(currencyData.toCurrency)} {formatNumber(amount * results.exchangeRate, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {results && results.error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <i className="fas fa-exclamation-circle text-error text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium text-error mb-1">Conversion Error</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{results.error}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
