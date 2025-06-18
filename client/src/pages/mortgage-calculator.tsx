import { useRef } from "react";
import { MortgageCalculator as MortgageCalculatorComponent } from "@/components/calculators/mortgage-calculator";
import { PageHeader } from "@/components/page-header";

export default function MortgageCalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <PageHeader 
        title="Mortgage Calculator" 
        description="Calculate your mortgage payments"
        exportTargetRef={exportRef}
      />
      <MortgageCalculatorComponent ref={exportRef}/>
    </div>
  );
}
