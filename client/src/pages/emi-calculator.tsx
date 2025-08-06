import { EMICalculator as EMICalculatorComponent } from "@/components/calculators/emi-calculator";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function EMICalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { emiData } = useCalculator();

  const handleSaveData = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted EMI: ", token);

      const payload = {
        loanAmount: emiData.loanAmount,
        interestRate: emiData.interestRate,
        loanTerm: emiData.loanTerm,
        termType: emiData.termType,
        startDate: emiData.startDate,
      };

      const res = await fetch("http://localhost:5000/api/emi-calculations", {
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
        throw new Error(errorData.error || "Failed to save EMI calculation");
      }
      toast.success("EMI calculation saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save EMI calculation");
    }
  };

  return (
    <div>
      <PageHeader 
        title="EMI Calculator" 
        description="Calculate loan EMI payments"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <EMICalculatorComponent ref={exportRef}/>
    </div>
  );
}
