import { ROICalculator as ROICalculatorComponent } from "@/components/calculators/roi-calculator";
import { PageHeader } from "@/components/page-header";

export default function ROICalculator() {
  return (
    <div>
      <PageHeader 
        title="ROI Calculator" 
        description="Calculate investment returns"
      />
      <ROICalculatorComponent />
    </div>
  );
}
