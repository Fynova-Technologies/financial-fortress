import { useState } from "react";
import { useRef } from "react";
import { MortgageCalculator as MortgageCalculatorComponent } from "@/components/calculators/mortgage-calculator";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { AuthPopup } from "@/components/auth/AuthPopup";
import { useMortgageCalculator } from "@/store/MortgageCalculatorProvider";

export default function MortgageCalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { isLoading, isAuthenticated } = useAuth0();
  const { saveMortgageToServer } = useMortgageCalculator();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

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
      await saveMortgageToServer();
      toast.success("Mortgage calculation saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save mortgage calculation");
    }
  };

  return (
    <div>
      <PageHeader
        title="Mortgage Calculator"
        description="Calculate your mortgage payments"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <MortgageCalculatorComponent ref={exportRef} />

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
