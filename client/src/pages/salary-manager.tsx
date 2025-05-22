import { SalaryManager as SalaryManagerComponent } from "@/components/calculators/salary-manager";
import { PageHeader } from "@/components/page-header";

export default function SalaryManager() {
  return (
    <div>
      <PageHeader 
        title="Salary Manager" 
        description="Analyze your salary and taxes"
      />
      <SalaryManagerComponent />
    </div>
  );
}
