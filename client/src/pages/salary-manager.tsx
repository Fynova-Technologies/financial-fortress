import { SalaryManager as SalaryManagerComponent } from "@/components/calculators/salary-manager";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { useCalculator } from "@/store/calculator-context";
import { useRef } from "react";
import {  toast } from "react-toastify";

export default function SalaryManager() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const { salaryData } = useCalculator();
  const handleSaveData = async () => {
    if (isLoading) {
      console.warn("Auth0 is still loading—try again later.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("access token granted Salary Manager: ", token);

      const payload = {
        grossSalary: salaryData.grossSalary,
        taxRate: salaryData.taxRate,
        deductions: salaryData.deductions,
        bonuses: salaryData.bonuses,
        period: salaryData.period,
      };

      const res = await fetch("http://localhost:5000/api/salary-management", {
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
        throw new Error(errorData.error || "Failed to save Salary Manager data");
      }
      toast.success("Salary Manager data saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save Salary Manager data");
    }
  }

  return (
    <div>
      <PageHeader 
        title="Salary Manager" 
        description="Analyze your salary and taxes"
        exportTargetRef={exportRef}
        onSave={handleSaveData}
      />
      <SalaryManagerComponent ref={exportRef}/>
    </div>
  );
}
