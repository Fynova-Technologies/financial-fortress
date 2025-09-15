import React from "react";
import { CalculationResult, MortgageData } from "./types";
import { useAuth0 } from "@auth0/auth0-react";
import {
  defaultMortgageData,
  updateMortgageDataImpl,
  calculateMortgage,
  normalizeMortgageInput,
} from "./services/mortgage";

interface MortgageCalculatorContextType {
  // Mortgage
  mortgageData: MortgageData;
  updateMortgageData: (data: Partial<MortgageData>) => void;
  calculatedResults: ReturnType<typeof calculateMortgage>;
  calculateMortgage: () => CalculationResult;

  // Server sync functions
  loadMortgageFromServer: () => Promise<void>;
  saveMortgageToServer: () => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
}

const MortgageCalculatorContext = React.createContext<
  MortgageCalculatorContextType | undefined
>(undefined);

export const useMortgageCalculator = (): MortgageCalculatorContextType => {
  const context = React.useContext(MortgageCalculatorContext);
  if (!context) {
    throw new Error(
      "useMortgageCalculator must be used within a MortgageCalculatorProvider"
    );
  }
  return context;
};

export const MortgageCalculatorProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const [mortgageData, setMortgageData] = React.useState<MortgageData>(defaultMortgageData);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const { user, getAccessTokenSilently } = useAuth0();

  const API_URL = import.meta.env.VITE_API_URL;

  //For now locally load/save on user change
  const updateMortgageData = (data: Partial<MortgageData>) => {
    setMortgageData((prev) => {
      const normalized = normalizeMortgageInput(data, prev);
      return updateMortgageDataImpl(prev, normalized);
    });
  };

  const calculatedResults = React.useMemo(() => calculateMortgage(mortgageData),[mortgageData]);

  const loadMortgageFromServer = async () => {
    if (!user || !getAccessTokenSilently) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${API_URL}/api/mortgage-calculations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch mortgage data:", res.statusText);
        return;
      }

      const all: any[] = await res.json();
      if (all.length === 0) return;

      const latest = all.reduce((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? a : b
      );

      // Parse Json
      //   const allCalculations: Array<{
      //     homePrice: number;
      //     downPaymentAmount: number;
      //       downPaymentPercent: number;
      //       interestRate: number;
      //       loanTerm: number;
      //       propertyTax: number;
      //       homeInsurance: number;
      //       pmi: number;
      //       createdAt: string;
      //   }> = await res.json();

      //   if (allCalculations.length === 0) return;
      //   const latest = allCalculations.reduce((a, b) =>
      //     new Date(a.createdAt) > new Date(b.createdAt) ? a : b
      //   );

      setMortgageData({
        homePrice: latest.homePrice,
        downPaymentAmount: latest.downPaymentAmount,
        downPaymentPercent: latest.downPaymentPercent,
        interestRate: latest.interestRate,
        loanTerm: latest.loanTerm,
        propertyTax: latest.propertyTax,
        homeInsurance: latest.homeInsurance,
        pmi: latest.pmi,
      });
      console.log("Mortgage data loaded from server");
    } catch (error) {
      console.error("Error loading mortgage data from server:", error);
    }
  };

  const saveMortgageToServer = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${API_URL}/api/mortgage-calculations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mortgageData),
        }
      );
      if (response.ok) {
        setLastSaved(new Date());
      } else {
        console.error("Failed to save mortgage data to server");
      }
    } catch (error) {
      console.error("Error saving mortgage data to server:", error);
    } finally {
      setIsSaving(false);
    }
  };

  //Auto load when user logs in
  React.useEffect(() => {
    if (user) loadMortgageFromServer();
  }, [user]);

  return (
    <MortgageCalculatorContext.Provider
      value={{
        mortgageData,
        updateMortgageData,
        calculatedResults,
        calculateMortgage: () => calculateMortgage(mortgageData),
        loadMortgageFromServer,
        saveMortgageToServer,
        isSaving,
        lastSaved,
      }}
    >
      {children}
    </MortgageCalculatorContext.Provider>
  );
};
