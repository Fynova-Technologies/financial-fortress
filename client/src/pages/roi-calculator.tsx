import { ROICalculator as ROICalculatorComponent } from "@/components/calculators/roi-calculator";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function ROICalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { roiData } = useCalculator();
  const handleSaveData = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted ROI Calculator: ", token);

      const payload = {
        initialInvestment: roiData.initialInvestment,
        additionalContribution: roiData.additionalContribution,
        contributionFrequency: roiData.contributionFrequency,
        annualRate: roiData.annualRate,
        compoundingFrequency: roiData.compoundingFrequency,
        investmentTerm: roiData.investmentTerm,
      };

      const res = await fetch("http://localhost:5000/api/roi-calculations", {
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
        throw new Error(errorData.error || "Failed to save ROI calculation");
      }
      toast.success("ROI calculation saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save ROI calculation");
    }
  }

  return (
    <div>
      <PageHeader 
        title="ROI Calculator" 
        description="Calculate investment returns"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <ROICalculatorComponent ref={exportRef}/>
    </div>
  );
}
