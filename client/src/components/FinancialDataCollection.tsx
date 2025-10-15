import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  monthlyDebtPayment: number;
  currentSavings: number;
  monthlySavings: number;
  retirementAge: number;
  retirementSavings: number;
  emergencyFundGoal: number;
  dti: number;
  savingsRate: number;
  emergencyFundMonths: number;
  netWorthGrowth: number;
}

interface FinancialDataCollectionProps {
  onComplete: (data: FinancialProfile) => void;
}

export default function FinancialDataCollection({ onComplete }: FinancialDataCollectionProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    totalDebt: '',
    monthlyDebtPayment: '',
    currentSavings: '',
    monthlySavings: '',
    retirementAge: '',
    retirementSavings: '',
    emergencyFundGoal: '6',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateMetrics = (): FinancialProfile => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const savings = parseFloat(formData.monthlySavings) || 0;
    const debt = parseFloat(formData.monthlyDebtPayment) || 0;
    const currentSavings = parseFloat(formData.currentSavings) || 0;
    const totalDebt = parseFloat(formData.totalDebt) || 0;
    
    const dti = income > 0 ? (debt / income) * 100 : 0;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const emergencyFundMonths = expenses > 0 ? currentSavings / expenses : 0;
    const netWorthGrowth = 8; // Default growth estimate

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      totalDebt,
      monthlyDebtPayment: debt,
      currentSavings,
      monthlySavings: savings,
      retirementAge: parseFloat(formData.retirementAge) || 65,
      retirementSavings: parseFloat(formData.retirementSavings) || 0,
      emergencyFundGoal: parseFloat(formData.emergencyFundGoal) || 6,
      dti,
      savingsRate,
      emergencyFundMonths,
      netWorthGrowth,
    };
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(calculateMetrics());
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.monthlyIncome && formData.monthlyExpenses && formData.monthlySavings;
    }
    if (step === 2) {
      return formData.totalDebt && formData.monthlyDebtPayment;
    }
    if (step === 3) {
      return formData.currentSavings && formData.emergencyFundGoal;
    }
    return true;
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">Financial Profile Setup</CardTitle>
          <CardDescription>Step {step} of {totalSteps}: Help us understand your finances</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Income & Expenses</h3>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (after tax)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="5000"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="3500"
                  value={formData.monthlyExpenses}
                  onChange={(e) => updateField('monthlyExpenses', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlySavings">Monthly Savings</Label>
                <Input
                  id="monthlySavings"
                  type="number"
                  placeholder="1500"
                  value={formData.monthlySavings}
                  onChange={(e) => updateField('monthlySavings', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Debt Information</h3>
              <div className="space-y-2">
                <Label htmlFor="totalDebt">Total Debt</Label>
                <Input
                  id="totalDebt"
                  type="number"
                  placeholder="0"
                  value={formData.totalDebt}
                  onChange={(e) => updateField('totalDebt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyDebtPayment">Monthly Debt Payment</Label>
                <Input
                  id="monthlyDebtPayment"
                  type="number"
                  placeholder="0"
                  value={formData.monthlyDebtPayment}
                  onChange={(e) => updateField('monthlyDebtPayment', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Savings & Goals</h3>
              <div className="space-y-2">
                <Label htmlFor="currentSavings">Current Savings</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  placeholder="10000"
                  value={formData.currentSavings}
                  onChange={(e) => updateField('currentSavings', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyFundGoal">Emergency Fund Goal (months)</Label>
                <Input
                  id="emergencyFundGoal"
                  type="number"
                  placeholder="6"
                  value={formData.emergencyFundGoal}
                  onChange={(e) => updateField('emergencyFundGoal', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirementAge">Target Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  placeholder="65"
                  value={formData.retirementAge}
                  onChange={(e) => updateField('retirementAge', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirementSavings">Current Retirement Savings</Label>
                <Input
                  id="retirementSavings"
                  type="number"
                  placeholder="50000"
                  value={formData.retirementSavings}
                  onChange={(e) => updateField('retirementSavings', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step === totalSteps ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
