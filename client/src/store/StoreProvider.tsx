// src/store/CalculatorProvider.tsx
import React from "react";
import { BudgetCalculatorProvider } from "./BudgetCalculatorProvider";
import { MortgageCalculatorProvider } from "./MortgageCalculatorProvider";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BudgetCalculatorProvider>
        <MortgageCalculatorProvider>
          {children}
        </MortgageCalculatorProvider>
    </BudgetCalculatorProvider>
  );
};
