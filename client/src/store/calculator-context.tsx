import { createContext, useContext, useState, ReactNode } from 'react';
import {
  BudgetData,
  MortgageData,
  EMIData,
  RetirementData,
  SalaryData,
  ROIData,
  CurrencyData,
  SavingsData,
  CalculationResult,
  ExpenseCategory,
  Expense,
  SavingsGoal
} from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CalculatorContextType {
  // Budget Planner
  budgetData: BudgetData;
  updateBudgetData: (data: Partial<BudgetData>) => void;
  addExpenseCategory: (category: ExpenseCategory) => void;
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteExpenseCategory: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Mortgage Calculator
  mortgageData: MortgageData;
  updateMortgageData: (data: Partial<MortgageData>) => void;
  calculateMortgage: () => CalculationResult;
  
  // EMI Calculator
  emiData: EMIData;
  updateEMIData: (data: Partial<EMIData>) => void;
  calculateEMI: () => CalculationResult;
  
  // Retirement Planner
  retirementData: RetirementData;
  updateRetirementData: (data: Partial<RetirementData>) => void;
  calculateRetirement: () => CalculationResult;
  
  // Salary Manager
  salaryData: SalaryData;
  updateSalaryData: (data: Partial<SalaryData>) => void;
  calculateSalary: () => CalculationResult;
  
  // ROI Calculator
  roiData: ROIData;
  updateROIData: (data: Partial<ROIData>) => void;
  calculateROI: () => CalculationResult;
  
  // Currency Converter
  currencyData: CurrencyData;
  updateCurrencyData: (data: Partial<CurrencyData>) => void;
  convertCurrency: () => CalculationResult;
  
  // Savings Tracker
  savingsData: SavingsData;
  updateSavingsData: (data: Partial<SavingsData>) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  calculateSavings: () => CalculationResult;
}

// Default values
const defaultBudgetData: BudgetData = {
  totalIncome: 0,
  totalExpenses: 0,
  expenseCategories: [
    { id: '1', name: 'Housing', amount: 0, color: '#3B82F6' }, //1200
    { id: '2', name: 'Food', amount: 0, color: '#10B981' }, //600
    { id: '3', name: 'Transportation', amount: 0, color: '#F59E0B' }, //400
    { id: '4', name: 'Utilities', amount: 0, color: '#EF4444' }, //300
    { id: '5', name: 'Entertainment', amount: 0, color: '#8B5CF6' }, //200
    { id: '6', name: 'Other', amount: 0, color: '#EC4899' }, //500
  ],
  expenses: [
    // { id: '1', description: 'Rent', category: 'Housing', date: '2023-07-01', amount: 1200 },
    // { id: '2', description: 'Groceries', category: 'Food', date: '2023-07-03', amount: 150 },
    // { id: '3', description: 'Internet', category: 'Utilities', date: '2023-07-05', amount: 80 },
    // { id: '4', description: 'Gas', category: 'Transportation', date: '2023-07-07', amount: 50 },
    // { id: '5', description: 'Netflix', category: 'Entertainment', date: '2023-07-10', amount: 15 },
    // { id: '6', description: 'Restaurant', category: 'Food', date: '2023-07-12', amount: 75 },
    // { id: '7', description: 'Phone Bill', category: 'Utilities', date: '2023-07-15', amount: 90 },
    // { id: '8', description: 'Car Payment', category: 'Transportation', date: '2023-07-15', amount: 350 },
    // { id: '9', description: 'Clothes', category: 'Other', date: '2023-07-18', amount: 120 },
    // { id: '10', description: 'Gym Membership', category: 'Other', date: '2023-07-20', amount: 50 },
  ]
};

const defaultMortgageData: MortgageData = {
  homePrice: 300000,
  downPaymentPercent: 20,
  downPaymentAmount: 60000,
  loanTerm: 30,
  interestRate: 4.5,
  propertyTax: 3600,
  homeInsurance: 1200,
  pmi: 0.5
};

const defaultEMIData: EMIData = {
  loanAmount: 25000,
  interestRate: 8.5,
  loanTerm: 5,
  termType: 'years',
  startDate: new Date().toISOString().split('T')[0]
};

const defaultRetirementData: RetirementData = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  monthlyContribution: 500,
  expectedReturn: 7,
  inflationRate: 2.5,
  desiredMonthlyIncome: 5000
};

const defaultSalaryData: SalaryData = {
  grossSalary: 75000,
  taxRate: 25,
  deductions: 5000,
  bonuses: 2000,
  period: 'annual'
};

const defaultROIData: ROIData = {
  initialInvestment: 10000,
  additionalContribution: 500,
  contributionFrequency: 'monthly',
  annualRate: 8,
  compoundingFrequency: 'monthly',
  investmentTerm: 10
};

const defaultCurrencyData: CurrencyData = {
  amount: 1000,
  fromCurrency: 'USD',
  toCurrency: 'EUR'
};

const defaultSavingsData: SavingsData = {
  savingsGoals: [
    { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 3000, targetDate: '2023-12-31' },
    { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 1500, targetDate: '2023-09-30' },
    { id: '3', name: 'New Car', targetAmount: 15000, currentAmount: 5000, targetDate: '2024-06-30' }
  ],
  monthlySavings: 800
};

// Create context
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Provider component
export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [budgetData, setBudgetData] = useState<BudgetData>(defaultBudgetData);
  const [mortgageData, setMortgageData] = useState<MortgageData>(defaultMortgageData);
  const [emiData, setEMIData] = useState<EMIData>(defaultEMIData);
  const [retirementData, setRetirementData] = useState<RetirementData>(defaultRetirementData);
  const [salaryData, setSalaryData] = useState<SalaryData>(defaultSalaryData);
  const [roiData, setROIData] = useState<ROIData>(defaultROIData);
  const [currencyData, setCurrencyData] = useState<CurrencyData>(defaultCurrencyData);
  const [savingsData, setSavingsData] = useState<SavingsData>(defaultSavingsData);

  // Budget Planner functions
  const updateBudgetData = (data: Partial<BudgetData>) => {
    setBudgetData(prev => ({ ...prev, ...data }));
  };

  const addExpenseCategory = (category: ExpenseCategory) => {
    setBudgetData(prev => ({
      ...prev,
      expenseCategories: [...prev.expenseCategories, category],
      totalExpenses: prev.totalExpenses + category.amount,
    }));
  };

  const updateExpenseCategory = (id: string, category: Partial<ExpenseCategory>) => {
    setBudgetData(prev => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map(cat => 
        cat.id === id ? { ...cat, ...category } : cat
      )
    }));
  };

  const deleteExpenseCategory = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenseCategories: prev.expenseCategories.filter(cat => cat.id !== id)
    }));
  };

  const addExpense = (expense: Expense) => {
    setBudgetData(prev => {
      const updatedExpenses = [...prev.expenses, expense];

      const updatedCategories = prev.expenseCategories.map(cat =>
        cat.name === expense.category
          ? { ...cat, amount: cat.amount + expense.amount }
          : cat
      );

      return {
        ...prev,
        expenses: updatedExpenses,
        expenseCategories: updatedCategories,
        totalExpenses: prev.totalExpenses + expense.amount,
      };
    });
  };


//Add expeneses even for new categories that don't exist

// const addExpense = (expense: Expense) => {      
//   setBudgetData(prev => {
//     const updatedExpenses = [...prev.expenses, expense];
//     const existingCategory = prev.expenseCategories.find(cat => cat.name === expense.category);

//     let updatedCategories = prev.expenseCategories;

//     if (existingCategory) {
//       updatedCategories = updatedCategories.map(cat =>
//         cat.name === expense.category
//           ? { ...cat, amount: cat.amount + expense.amount }
//           : cat
//       );
//     } else {
//       // Create new category with default color
//       updatedCategories = [
//         ...updatedCategories,
//         {
//           id: crypto.randomUUID(),
//           name: expense.category,
//           amount: expense.amount,
//           color: "#3B82F6", // or any random color generator
//         },
//       ];
//     }

//     return {
//       ...prev,
//       expenses: updatedExpenses,
//       expenseCategories: updatedCategories,
//       totalExpenses: prev.totalExpenses + expense.amount,
//     };
//   });
// };



  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setBudgetData(prev => {
      const oldExpense = prev.expenses.find(e => e.id === id);
      const amountDiff = oldExpense && expense.amount !== undefined 
        ? expense.amount - oldExpense.amount
        : 0;
      
      return {
        ...prev,
        expenses: prev.expenses.map(exp => 
          exp.id === id ? { ...exp, ...expense } : exp
        ),
        totalExpenses: prev.totalExpenses + amountDiff
      };
    });
  };

  const deleteExpense = (id: string) => {
    setBudgetData(prev => {
      const expense = prev.expenses.find(e => e.id === id);
      return {
        ...prev,
        expenses: prev.expenses.filter(exp => exp.id !== id),
        totalExpenses: expense ? prev.totalExpenses - expense.amount : prev.totalExpenses
      };
    });
  };

  // Mortgage Calculator functions
  const updateMortgageData = (data: Partial<MortgageData>) => {
    if (data.homePrice !== undefined && data.downPaymentPercent !== undefined) {
      data.downPaymentAmount = data.homePrice * (data.downPaymentPercent / 100);
    } else if (data.homePrice !== undefined && data.downPaymentAmount !== undefined) {
      data.downPaymentPercent = (data.downPaymentAmount / data.homePrice) * 100;
    } else if (data.downPaymentPercent !== undefined && mortgageData.homePrice) {
      data.downPaymentAmount = mortgageData.homePrice * (data.downPaymentPercent / 100);
    } else if (data.downPaymentAmount !== undefined && mortgageData.homePrice) {
      data.downPaymentPercent = (data.downPaymentAmount / mortgageData.homePrice) * 100;
    }
    
    setMortgageData(prev => ({ ...prev, ...data }));
  };

  const calculateMortgage = () => {
    const { homePrice, downPaymentAmount, loanTerm, interestRate, propertyTax, homeInsurance, pmi } = mortgageData;
    const loanAmount = homePrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly mortgage payment (principal + interest)
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / totalPayments;
    } else {
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }
    
    // Calculate PMI (if down payment < 20%)
    const downPaymentPercent = (downPaymentAmount / homePrice) * 100;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * (pmi / 100)) / 12 : 0;
    
    // Calculate monthly property tax and insurance
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    
    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
    
    // Calculate total interest
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;
    
    // Calculate total cost
    const totalCost = totalMonthlyPayment * totalPayments;
    
    // Generate amortization schedule (yearly for simplicity)
    const amortizationSchedule = [];
    let remainingBalance = loanAmount;
    
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = remainingBalance * monthlyRate;
        const monthlyPrincipal = monthlyPayment - monthlyInterest;
        
        yearlyInterest += monthlyInterest;
        yearlyPrincipal += monthlyPrincipal;
        remainingBalance -= monthlyPrincipal;
      }
      
      amortizationSchedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, remainingBalance)
      });
    }
    
    // Generate chart data
    const chartData = [
      { name: 'Principal', value: loanAmount },
      { name: 'Interest', value: totalInterest },
      { name: 'Property Tax', value: propertyTax * loanTerm },
      { name: 'Insurance', value: homeInsurance * loanTerm }
    ];
    
    if (monthlyPMI > 0) {
      chartData.push({ name: 'PMI', value: monthlyPMI * 12 * loanTerm });
    }
    
    return {
      loanAmount,
      monthlyPayment,
      totalMonthlyPayment,
      totalInterest,
      totalCost,
      amortizationSchedule,
      chartData
    };
  };

  // EMI Calculator functions
  const updateEMIData = (data: Partial<EMIData>) => {
    setEMIData(prev => ({ ...prev, ...data }));
  };

  const calculateEMI = () => {
    const { loanAmount, interestRate, loanTerm, termType, startDate } = emiData;
    const termMonths = termType === 'years' ? loanTerm * 12 : loanTerm;
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly EMI
    let monthlyEMI = 0;
    if (monthlyRate === 0) {
      monthlyEMI = loanAmount / termMonths;
    } else {
      monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    // Calculate total interest and payment
    const totalPayment = monthlyEMI * termMonths;
    const totalInterest = totalPayment - loanAmount;
    
    // Generate repayment schedule
    const repaymentSchedule = [];
    let remainingBalance = loanAmount;
    const startDateObj = new Date(startDate);
    
    for (let i = 1; i <= termMonths; i++) {
      const date = new Date(startDateObj);
      date.setMonth(startDateObj.getMonth() + i);
      
      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = monthlyEMI - monthlyInterest;
      remainingBalance -= monthlyPrincipal;
      
      repaymentSchedule.push({
        number: i,
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
        emi: monthlyEMI,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: Math.max(0, remainingBalance)
      });
    }
    
    // Generate chart data
    const chartData = [
      { name: 'Principal', value: loanAmount },
      { name: 'Interest', value: totalInterest }
    ];
    
    return {
      monthlyEMI,
      totalInterest,
      totalPayment,
      repaymentSchedule,
      chartData
    };
  };

  // Retirement Planner functions
  const updateRetirementData = (data: Partial<RetirementData>) => {
    setRetirementData(prev => ({ ...prev, ...data }));
  };

  const calculateRetirement = () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      inflationRate,
      desiredMonthlyIncome
    } = retirementData;
    
    const yearsUntilRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate projected savings at retirement
    const monthlyRate = expectedReturn / 100 / 12;
    const numMonthsUntilRetirement = yearsUntilRetirement * 12;
    
    let projectedSavings = currentSavings * Math.pow(1 + monthlyRate, numMonthsUntilRetirement);
    projectedSavings += monthlyContribution * ((Math.pow(1 + monthlyRate, numMonthsUntilRetirement) - 1) / monthlyRate);
    
    // Calculate inflation-adjusted desired income
    const inflationFactor = Math.pow(1 + (inflationRate / 100), yearsUntilRetirement);
    const inflationAdjustedMonthlyIncome = desiredMonthlyIncome * inflationFactor;
    
    // Calculate how much monthly income the savings can provide in retirement
    // Using the 4% rule as a simple estimate
    const annualWithdrawalRate = 0.04;
    const projectedMonthlyIncome = (projectedSavings * annualWithdrawalRate) / 12;
    
    // Check if the goal is met
    const isGoalMet = projectedMonthlyIncome >= inflationAdjustedMonthlyIncome;
    
    // Generate recommendations
    const recommendations = [];
    if (!isGoalMet) {
      const additionalNeeded = inflationAdjustedMonthlyIncome - projectedMonthlyIncome;
      const additionalSavingsNeeded = additionalNeeded * 12 / annualWithdrawalRate;
      const additionalMonthlySavingsNeeded = additionalSavingsNeeded / 
        ((Math.pow(1 + monthlyRate, numMonthsUntilRetirement) - 1) / monthlyRate);
      
      recommendations.push(`Increase your monthly contribution by ${formatCurrency(additionalMonthlySavingsNeeded)} to meet your retirement goal.`);
      recommendations.push(`Consider adjusting your investment strategy to achieve a higher return.`);
    } else {
      recommendations.push(`Your current savings plan is on track to meet your retirement goal.`);
      recommendations.push(`Consider setting aside extra savings for unexpected expenses in retirement.`);
    }
    
    recommendations.push(`Review your retirement plan annually to stay on track.`);
    recommendations.push(`Consider consulting with a financial advisor for personalized advice.`);
    
    // Generate chart data for retirement growth
    const chartData = [];
    let currentTotal = currentSavings;
    
    for (let year = currentAge; year <= retirementAge; year++) {
      currentTotal = currentTotal * (1 + expectedReturn / 100) + (monthlyContribution * 12);
      chartData.push({
        age: year,
        savings: currentTotal
      });
    }
    
    return {
      projectedSavings,
      yearsUntilRetirement,
      projectedMonthlyIncome,
      inflationAdjustedMonthlyIncome,
      isGoalMet,
      goalSummary: isGoalMet
        ? "Based on your current savings rate and expected return, you're projected to meet your retirement income goal."
        : "Your current savings plan may not be sufficient to meet your retirement income goal.",
      recommendations,
      chartData
    };
  };

  // Salary Manager functions
  const updateSalaryData = (data: Partial<SalaryData>) => {
    setSalaryData(prev => ({ ...prev, ...data }));
  };

  const calculateSalary = () => {
    const { grossSalary, taxRate, deductions, bonuses, period } = salaryData;
    
    // Convert to annual if needed
    const annualGrossSalary = period === 'monthly' ? grossSalary * 12 : grossSalary;
    const annualBonuses = bonuses;
    const annualDeductions = deductions;
    
    // Calculate tax
    const taxAmount = (annualGrossSalary * taxRate) / 100;
    
    // Calculate net salary
    const annualNetSalary = annualGrossSalary - taxAmount - annualDeductions + annualBonuses;
    const monthlyNetSalary = annualNetSalary / 12;
    
    // Calculate biweekly and weekly pay
    const biweeklyNetPay = annualNetSalary / 26;
    const weeklyNetPay = annualNetSalary / 52;
    
    // Generate breakdown
    const breakdown = [
      { category: 'Gross Salary', amount: annualGrossSalary },
      { category: 'Tax', amount: -taxAmount },
      { category: 'Deductions', amount: -annualDeductions },
      { category: 'Bonuses', amount: annualBonuses },
      { category: 'Net Salary', amount: annualNetSalary }
    ];
    
    // Generate chart data
    const chartData = [
      { name: 'Take-home Pay', value: annualNetSalary },
      { name: 'Tax', value: taxAmount },
      { name: 'Deductions', value: annualDeductions }
    ];
    
    return {
      annualGrossSalary,
      annualNetSalary,
      monthlyNetSalary,
      biweeklyNetPay,
      weeklyNetPay,
      taxAmount,
      breakdown,
      chartData
    };
  };

  // ROI Calculator functions
  const updateROIData = (data: Partial<ROIData>) => {
    setROIData(prev => ({ ...prev, ...data }));
  };

  const calculateROI = () => {
    const {
      initialInvestment,
      additionalContribution,
      contributionFrequency,
      annualRate,
      compoundingFrequency,
      investmentTerm
    } = roiData;
    
    // Calculate number of compounding periods
    let periodsPerYear = 1;
    switch (compoundingFrequency) {
      case 'daily': periodsPerYear = 365; break;
      case 'monthly': periodsPerYear = 12; break;
      case 'quarterly': periodsPerYear = 4; break;
      case 'annually': periodsPerYear = 1; break;
    }
    
    const ratePerPeriod = annualRate / 100 / periodsPerYear;
    const totalPeriods = periodsPerYear * investmentTerm;
    
    // Calculate contribution per compounding period
    let contributionsPerYear = 0;
    switch (contributionFrequency) {
      case 'monthly': contributionsPerYear = 12; break;
      case 'quarterly': contributionsPerYear = 4; break;
      case 'annual': contributionsPerYear = 1; break;
    }
    
    const contributionPerPeriod = additionalContribution * (contributionsPerYear / periodsPerYear);
    
    // Calculate final value with compound interest and regular contributions
    let finalValue = initialInvestment;
    let interestEarned = 0;
    let totalContributions = initialInvestment;
    
    // Generate chart data for growth over time
    const chartData = [];
    chartData.push({ year: 0, amount: initialInvestment });
    
    for (let year = 1; year <= investmentTerm; year++) {
      const periodsThisYear = year === investmentTerm ? periodsPerYear : periodsPerYear;
      
      for (let period = 1; period <= periodsThisYear; period++) {
        const interestThisPeriod = finalValue * ratePerPeriod;
        interestEarned += interestThisPeriod;
        finalValue += interestThisPeriod;
        
        // Add contribution if it's a contribution period
        if (contributionsPerYear > 0 && 
            (period % (periodsPerYear / contributionsPerYear) === 0 || 
             contributionsPerYear > periodsPerYear)) {
          finalValue += contributionPerPeriod;
          totalContributions += contributionPerPeriod;
        }
      }
      
      chartData.push({ year, amount: finalValue });
    }
    
    // Calculate total contributions
    const totalAdditionalContributions = totalContributions - initialInvestment;
    
    // Calculate ROI
    const roi = ((finalValue - totalContributions) / totalContributions) * 100;
    
    return {
      finalValue,
      interestEarned,
      totalContributions,
      totalAdditionalContributions,
      roi,
      chartData
    };
  };

  // Currency Converter functions
  const updateCurrencyData = (data: Partial<CurrencyData>) => {
    setCurrencyData(prev => ({ ...prev, ...data }));
  };

  const convertCurrency = () => {
    const { amount, fromCurrency, toCurrency } = currencyData;
    
    // Static exchange rates for demo purposes
    // In a real app, you would use an API
    const exchangeRates = {
      USD: { EUR: 0.85, GBP: 0.75, JPY: 110.2, CAD: 1.25, AUD: 1.35, INR: 74.5 },
      EUR: { USD: 1.18, GBP: 0.88, JPY: 129.7, CAD: 1.47, AUD: 1.59, INR: 87.7 },
      GBP: { USD: 1.33, EUR: 1.14, JPY: 147.0, CAD: 1.67, AUD: 1.81, INR: 99.5 },
      JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0068, CAD: 0.0113, AUD: 0.0123, INR: 0.68 },
      CAD: { USD: 0.80, EUR: 0.68, GBP: 0.60, JPY: 88.2, AUD: 1.08, INR: 59.7 },
      AUD: { USD: 0.74, EUR: 0.63, GBP: 0.55, JPY: 81.6, CAD: 0.93, INR: 55.2 },
      INR: { USD: 0.0134, EUR: 0.0114, GBP: 0.0101, JPY: 1.48, CAD: 0.0168, AUD: 0.0181 }
    };
    
    // Check if we have direct exchange rate
    if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      const convertedAmount = amount * rate;
      
      // Generate historical data for chart (simulated)
      const chartData = [];
      const today = new Date();
      const baseRate = rate;
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Create some random fluctuation around the current rate
        const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
        const historicalRate = baseRate * randomFactor;
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          rate: historicalRate
        });
      }
      
      return {
        convertedAmount,
        exchangeRate: rate,
        chartData
      };
    }
    
    // If we don't have direct rate, convert via USD (simplified approach)
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const toUSD = exchangeRates[fromCurrency].USD;
      const fromUSD = exchangeRates['USD'][toCurrency];
      
      const rate = toUSD * fromUSD;
      const convertedAmount = amount * rate;
      
      // Simplified chart data using the calculated rate
      const chartData = [];
      const today = new Date();
      const baseRate = rate;
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Create some random fluctuation around the current rate
        const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
        const historicalRate = baseRate * randomFactor;
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          rate: historicalRate
        });
      }
      
      return {
        convertedAmount,
        exchangeRate: rate,
        chartData
      };
    }
    
    // Fallback for unsupported currency pairs
    return {
      convertedAmount: 0,
      exchangeRate: 0,
      error: "Unsupported currency pair"
    };
  };

  // Savings Tracker functions
  const updateSavingsData = (data: Partial<SavingsData>) => {
    setSavingsData(prev => ({ ...prev, ...data }));
  };

  const addSavingsGoal = (goal: SavingsGoal) => {
    setSavingsData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, goal]
    }));
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    setSavingsData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => 
        g.id === id ? { ...g, ...goal } : g
      )
    }));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(g => g.id !== id)
    }));
  };

  const calculateSavings = () => {
    const { savingsGoals, monthlySavings } = savingsData;
    
    // Calculate progress and projections for each goal
    const goalResults = savingsGoals.map(goal => {
      const targetDate = new Date(goal.targetDate);
      const currentDate = new Date();
      
      // Calculate months remaining
      const monthsRemaining = 
        (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
        (targetDate.getMonth() - currentDate.getMonth());
      
      // Calculate amount needed per month
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const monthlyNeeded = remainingAmount / Math.max(1, monthsRemaining);
      
      // Calculate if goal is achievable with current monthly savings
      const isAchievable = monthlyNeeded <= monthlySavings;
      
      // Calculate expected completion date based on current savings rate
      let expectedCompletionDate = new Date(currentDate);
      if (monthlySavings > 0) {
        const monthsToCompletion = Math.ceil(remainingAmount / monthlySavings);
        expectedCompletionDate.setMonth(currentDate.getMonth() + monthsToCompletion);
      } else {
        expectedCompletionDate = new Date('2099-12-31'); // Far future if no monthly savings
      }
      
      // Calculate progress percentage
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
      
      return {
        ...goal,
        monthsRemaining,
        monthlyNeeded,
        isAchievable,
        expectedCompletionDate: expectedCompletionDate.toISOString().split('T')[0],
        progressPercentage,
        isOnTrack: isAchievable && monthsRemaining > 0
      };
    });
    
    // Generate chart data for savings projection
    const chartData = [];
    const today = new Date();
    
    // Project 24 months into the future
    for (let month = 0; month <= 24; month++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() + month);
      
      // Create projection for each goal
      const goalsData = goalResults.map(goal => {
        let projectedAmount = goal.currentAmount;
        
        // Calculate projected amount for this month
        if (month > 0) {
          // Allocate monthly savings proportionally to goals that are not yet met
          const unmetGoals = goalResults.filter(g => g.currentAmount < g.targetAmount);
          const totalRemaining = unmetGoals.reduce((sum, g) => sum + (g.targetAmount - g.currentAmount), 0);
          
          if (goal.currentAmount < goal.targetAmount && totalRemaining > 0) {
            const allocation = monthlySavings * ((goal.targetAmount - goal.currentAmount) / totalRemaining);
            projectedAmount = Math.min(goal.targetAmount, goal.currentAmount + (allocation * month));
          }
        }
        
        return {
          id: goal.id,
          name: goal.name,
          amount: projectedAmount
        };
      });
      
      chartData.push({
        month,
        date: date.toISOString().split('T')[0],
        goals: goalsData
      });
    }
    
    return {
      goalResults,
      totalSaved: savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
      totalTarget: savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0),
      chartData
    };
  };

  const value = {
    budgetData,
    updateBudgetData,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    
    mortgageData,
    updateMortgageData,
    calculateMortgage,
    
    emiData,
    updateEMIData,
    calculateEMI,
    
    retirementData,
    updateRetirementData,
    calculateRetirement,
    
    salaryData,
    updateSalaryData,
    calculateSalary,
    
    roiData,
    updateROIData,
    calculateROI,
    
    currencyData,
    updateCurrencyData,
    convertCurrency,
    
    savingsData,
    updateSavingsData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateSavings
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
