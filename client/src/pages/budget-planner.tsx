
import { BudgetPlanner as BudgetPlannerComponent } from "@/components/calculators/budget-planner";
import { PageHeader } from "@/components/page-header";
import { useRef } from "react";

export default function BudgetPlanner() {
  const exportRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <PageHeader 
        title="Budget Planner" 
        description="Track your income and expenses"
        exportTargetRef={exportRef}
      />
      <BudgetPlannerComponent ref={exportRef}/>
    </div>
  );
}
