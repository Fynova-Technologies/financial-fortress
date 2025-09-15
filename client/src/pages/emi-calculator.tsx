import { useState } from "react";
import { EMICalculator as EMICalculatorComponent } from "@/components/calculators/emi-calculator";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/index";
import { useRef } from "react";
import { toast } from "react-toastify";
import { AuthPopup } from "@/components/auth/AuthPopup";

export default function EMICalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { emiData } = useCalculator();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);
  const { isAuthenticated } = useAuth0();

  const handleSaveData = async () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

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

      const res = await fetch("https://financial-fortress.onrender.com/api/emi-calculations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
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
      <EMICalculatorComponent ref={exportRef} />

      {showAuthPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="pointer-events-auto max-w-lg w-full px-4">
            <AuthPopup
              visible={showAuthPopup}
              onClose={() => setShowAuthPopup(false)}
              onLogin={() => {}}
              onSignup={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
