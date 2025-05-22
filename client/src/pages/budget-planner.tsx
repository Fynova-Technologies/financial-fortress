import { BudgetPlanner as BudgetPlannerComponent } from "@/components/calculators/budget-planner";
import { PageHeader } from "@/components/page-header";

export default function BudgetPlanner() {
  return (
    <div>
      <PageHeader 
        title="Budget Planner" 
        description="Track your income and expenses"
      />
      <BudgetPlannerComponent />
    </div>
  );
}
