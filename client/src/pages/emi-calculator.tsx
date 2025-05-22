import { EMICalculator as EMICalculatorComponent } from "@/components/calculators/emi-calculator";
import { PageHeader } from "@/components/page-header";

export default function EMICalculator() {
  return (
    <div>
      <PageHeader 
        title="EMI Calculator" 
        description="Calculate loan EMI payments"
      />
      <EMICalculatorComponent />
    </div>
  );
}
