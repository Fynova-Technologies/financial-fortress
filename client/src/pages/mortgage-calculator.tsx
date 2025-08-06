import { useRef } from "react";
import { MortgageCalculator as MortgageCalculatorComponent } from "@/components/calculators/mortgage-calculator";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { toast } from "react-toastify";

export default function MortgageCalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { mortgageData } = useCalculator();

  const handleSaveData = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted mortgage: ", token);

      const payload = {
        homePrice: mortgageData.homePrice,
        downPaymentAmount: mortgageData.downPaymentAmount,
        downPaymentPercent: mortgageData.downPaymentPercent,
        loanTerm: mortgageData.loanTerm,
        interestRate: mortgageData.interestRate,
        propertyTax: mortgageData.propertyTax,
        homeInsurance: mortgageData.homeInsurance,
        pmi: mortgageData.pmi
      };

      const res = await fetch("http://localhost:5000/api/mortgage-calculations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response error:", errorData);
        throw new Error(errorData.error || "Failed to save mortgage calculation");
      }
      toast.success("Mortgage calculation saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save mortgage calculation");
    }
  }

  return (
    <div>
      <PageHeader 
        title="Mortgage Calculator" 
        description="Calculate your mortgage payments"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <MortgageCalculatorComponent ref={exportRef}/>
    </div>
  );
}
