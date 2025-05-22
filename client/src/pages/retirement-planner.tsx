import { RetirementPlanner as RetirementPlannerComponent } from "@/components/calculators/retirement-planner";
import { PageHeader } from "@/components/page-header";

export default function RetirementPlanner() {
  return (
    <div>
      <PageHeader 
        title="Retirement Planner" 
        description="Plan for your retirement"
      />
      <RetirementPlannerComponent />
    </div>
  );
}
