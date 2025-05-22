import { MortgageCalculator as MortgageCalculatorComponent } from "@/components/calculators/mortgage-calculator";
import { PageHeader } from "@/components/page-header";

export default function MortgageCalculator() {
  return (
    <div>
      <PageHeader 
        title="Mortgage Calculator" 
        description="Calculate your mortgage payments"
      />
      <MortgageCalculatorComponent />
    </div>
  );
}
