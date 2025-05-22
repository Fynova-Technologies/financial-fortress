import { SavingsTracker as SavingsTrackerComponent } from "@/components/calculators/savings-tracker";
import { PageHeader } from "@/components/page-header";

export default function SavingsTracker() {
  return (
    <div>
      <PageHeader 
        title="Savings Tracker" 
        description="Track your savings goals"
      />
      <SavingsTrackerComponent />
    </div>
  );
}
