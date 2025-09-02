
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
  SavingsGoal,
} from "./types";

/* defaults & impls */
import {
  defaultBudgetData,
  addExpenseCategoryImpl,
  updateExpenseCategoryImpl,
  deleteExpenseCategoryImpl,
  addExpenseImpl,
  updateExpenseImpl,
  deleteExpenseImpl,
} from "./services/budget";

import { defaultMortgageData, normalizeMortgageInput, calculateMortgage } from "./services/mortgage";
import { defaultEMIData, calculateEMI } from "./services/emi";
import { defaultRetirementData, calculateRetirement } from "./services/retirement";
import { defaultSalaryData, calculateSalary } from "./services/salary";
import { defaultROIData, calculateROI } from "./services/roi";
import { defaultCurrencyData, convertCurrency } from "./services/currency";
import { defaultSavingsData, calculateSavings } from "./services/savings";


interface CalculatorContextType {
  // Budget
  budgetData: BudgetData;
  updateBudgetData: (data: Partial<BudgetData>) => void;
  addExpenseCategory: (category: ExpenseCategory) => void;
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteExpenseCategory: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Mortgage
  mortgageData: MortgageData;
  updateMortgageData: (data: Partial<MortgageData>) => void;
  calculateMortgage: () => CalculationResult;

  // EMI
  emiData: EMIData;
  updateEMIData: (data: Partial<EMIData>) => void;
  calculateEMI: () => CalculationResult;

  // Retirement
  retirementData: RetirementData;
  updateRetirementData: (data: Partial<RetirementData>) => void;
  calculateRetirement: () => CalculationResult;

  // Salary
  salaryData: SalaryData;
  updateSalaryData: (data: Partial<SalaryData>) => void;
  calculateSalary: () => CalculationResult;

  // ROI
  roiData: ROIData;
  updateROIData: (data: Partial<ROIData>) => void;
  calculateROI: () => CalculationResult;

  // Currency
  currencyData: CurrencyData;
  updateCurrencyData: (data: Partial<CurrencyData>) => void;
  convertCurrency: () => Promise<CalculationResult>;

  // Savings
  savingsData: SavingsData;
  updateSavingsData: (data: Partial<SavingsData>) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  calculateSavings: () => CalculationResult;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [budgetData, setBudgetData] = useState<BudgetData>(defaultBudgetData);
  const [mortgageData, setMortgageData] = useState<MortgageData>(defaultMortgageData);
  const [emiData, setEMIData] = useState<EMIData>(defaultEMIData);
  const [retirementData, setRetirementData] = useState<RetirementData>(defaultRetirementData);
  const [salaryData, setSalaryData] = useState<SalaryData>(defaultSalaryData);
  const [roiData, setROIData] = useState<ROIData>(defaultROIData);
  const [currencyData, setCurrencyData] = useState<CurrencyData>(defaultCurrencyData);
  const [savingsData, setSavingsData] = useState<SavingsData>(defaultSavingsData);

  // Auth0 token (used in savings delete example)
  const { getAccessTokenSilently, user } = useAuth0();

  // ---------- Budget ----------
  const updateBudgetData = (data: Partial<BudgetData>) => setBudgetData((p) => ({ ...p, ...data }));
  const addExpenseCategory = (category: ExpenseCategory) => setBudgetData((prev) => addExpenseCategoryImpl(prev, category));
  const updateExpenseCategory = (id: string, category: Partial<ExpenseCategory>) =>
    setBudgetData((prev) => updateExpenseCategoryImpl(prev, id, category));
  const deleteExpenseCategory = (id: string) => setBudgetData((prev) => deleteExpenseCategoryImpl(prev, id));
  const addExpense = (expense: Expense) => setBudgetData((prev) => addExpenseImpl(prev, expense));
  const updateExpense = (id: string, expense: Partial<Expense>) => setBudgetData((prev) => updateExpenseImpl(prev, id, expense));
  const deleteExpense = (id: string) => setBudgetData((prev) => deleteExpenseImpl(prev, id));

  // ---------- Mortgage ----------
  const updateMortgageData = (data: Partial<MortgageData>) => {
    setMortgageData((prev) => normalizeMortgageInput(data, prev));
  };

  const handleCalculateMortgage = () => calculateMortgage(mortgageData);

  // ---------- EMI ----------
  const updateEMIData = (data: Partial<EMIData>) => setEMIData((prev) => ({ ...prev, ...data }));
  const handleCalculateEMI = () => calculateEMI(emiData);

  // ---------- Retirement ----------
  const updateRetirementData = (data: Partial<RetirementData>) => setRetirementData((prev) => ({ ...prev, ...data }));
  const handleCalculateRetirement = () => calculateRetirement(retirementData);

  // ---------- Salary ----------
  const updateSalaryData = (data: Partial<SalaryData>) => setSalaryData((prev) => ({ ...prev, ...data }));
  const handleCalculateSalary = () => calculateSalary(salaryData);

  // ---------- ROI ----------
  const updateROIData = (data: Partial<ROIData>) => setROIData((prev) => ({ ...prev, ...data }));
  const handleCalculateROI = () => calculateROI(roiData);

  // ---------- Currency ----------
  const updateCurrencyData = (data: Partial<CurrencyData>) => setCurrencyData((prev) => ({ ...prev, ...data }));
  const handleConvertCurrency = async () => {
    return await convertCurrency(currencyData);
  };

  // ---------- Savings ----------
  const updateSavingsData = (data: Partial<SavingsData>) => setSavingsData((prev) => ({ ...prev, ...data }));
  const addSavingsGoal = (goal: SavingsGoal) => setSavingsData((prev) => ({ ...prev, savingsGoals: [...prev.savingsGoals, goal] }));
  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) =>
    setSavingsData((prev) => ({ ...prev, savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...goal } : g)) }));

  const deleteSavingsGoal = async (id: string) => {
      // Check if user is logged in
  if (!user) {
    console.warn("User not logged in for deletion");
    
    // Optional: remove locally for offline mode
    setSavingsData((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
    
    return; // stop here
  }
    // original had a backend call; we keep the async behavior and optimistic update on success
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5000/api/savings-goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Delete failed: ${response.status} ${txt}`);
      }
      setSavingsData((prev) => ({ ...prev, savingsGoals: prev.savingsGoals.filter((g) => g.id !== id) }));
    } catch (err) {
      console.error("Failed to delete savings goal:", err);
      // fallback: remove locally if needed or keep UI informed (alert/log)
      // do not automatically remove locally without confirmation if backend fails
      // here we simply rethrow so caller UI can handle
      throw err;
    }
  };

  const handleCalculateSavings = () => calculateSavings(savingsData);

  const value: CalculatorContextType = {
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
    calculateMortgage: handleCalculateMortgage,

    emiData,
    updateEMIData,
    calculateEMI: handleCalculateEMI,

    retirementData,
    updateRetirementData,
    calculateRetirement: handleCalculateRetirement,

    salaryData,
    updateSalaryData,
    calculateSalary: handleCalculateSalary,

    roiData,
    updateROIData,
    calculateROI: handleCalculateROI,

    currencyData,
    updateCurrencyData,
    convertCurrency: handleConvertCurrency,

    savingsData,
    updateSavingsData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateSavings: handleCalculateSavings,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
};

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
};
