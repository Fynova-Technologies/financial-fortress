import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale = 'en-US', currency = 'USD', digits = 2): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(amount);
}

export function formatPercentage(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value / 100);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

export function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (monthlyRate === 0) return principal / totalPayments;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
         (Math.pow(1 + monthlyRate, totalPayments) - 1);
}

export function calculateEMI(principal: number, annualRate: number, termMonths: number): number {
  const monthlyRate = annualRate / 100 / 12;
  
  if (monthlyRate === 0) return principal / termMonths;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
}

export function calculateCompoundInterest(
  principal: number, 
  annualRate: number, 
  years: number, 
  compoundingPerYear = 12,
  monthlyContribution = 0
): number {
  const rate = annualRate / 100 / compoundingPerYear;
  const n = compoundingPerYear * years;
  
  if (monthlyContribution === 0) {
    return principal * Math.pow(1 + rate, n);
  }
  
  return principal * Math.pow(1 + rate, n) + 
         monthlyContribution * ((Math.pow(1 + rate, n) - 1) / rate);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function getRandomColor(index: number): string {
  const colors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-amber-500 text-white',
    'bg-red-500 text-white',
    'bg-purple-500 text-white',
    'bg-indigo-500 text-white',
    'bg-pink-500 text-white',
    'bg-teal-500 text-white'
  ];
  
  return colors[index % colors.length];
}

export function getChartColors(count: number): string[] {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];
  
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // If we need more colors than in our predefined list
  const result = [...colors];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137) % 360; // Golden angle in degrees for nice distribution
    result.push(`hsl(${hue}, 80%, 60%)`);
  }
  
  return result;
}
