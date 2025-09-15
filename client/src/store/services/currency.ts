
import { CurrencyData } from "../types";

export const defaultCurrencyData: CurrencyData = {
  amount: 1000,
  fromCurrency: "USD",
  toCurrency: "EUR",
};

type ConvertResult =
  | {
      convertedAmount: number;
      exchangeRate: number;
      chartData: Array<{ date: string; rate: number }>;
    }
  | { convertedAmount: 0; exchangeRate: 0; chartData: []; error: string };

const FASTFOREX_API_KEY = "18e97278dd-a8ec6d38b4-t0s6ym"; // keep as-is or move to env

export async function convertCurrency(currencyData: CurrencyData): Promise<ConvertResult> {
  const { amount, fromCurrency, toCurrency } = currencyData;

  try {
    const res = await fetch(
      `https://api.fastforex.io/convert?api_key=${FASTFOREX_API_KEY}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
    );
    if (!res.ok) throw new Error("Failed to fetch conversion data");
    const data = await res.json();
    if (!data.result?.rate || !data.result[toCurrency]) throw new Error("Invalid conversion response");

    const today = new Date();
    const endDate = today.toISOString().split("T")[0];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 13);
    const start = startDate.toISOString().split("T")[0];

    const historyRes = await fetch(
      `https://api.fastforex.io/time-series?api_key=${FASTFOREX_API_KEY}&from=${fromCurrency}&to=${toCurrency}&start=${start}&end=${endDate}`
    );
    if (!historyRes.ok) throw new Error("Failed to fetch historical data");
    const historyData = await historyRes.json();
    const rates = historyData.results?.[toCurrency];

    if (!rates) throw new Error("Invalid historical data");

    const chartData = Object.entries(rates).map(([date, rate]: any) => ({ date, rate }));
    return {
      convertedAmount: data.result[toCurrency],
      exchangeRate: data.result.rate,
      chartData: chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    };
  } catch (err: any) {
    console.error("Currency conversion error:", err.message || err);
    return {
      convertedAmount: 0,
      exchangeRate: 0,
      chartData: [],
      error: err.message || "Failed to fetch currency data. Please try again.",
    };
  }
}
