import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, PiggyBank, Target, ChevronRight, ChevronLeft, Calculator, AlertCircle } from 'lucide-react';

type FinancialDataFormProps = {
  onComplete: (data: FinancialProfile) => void;
  onSkip?: () => void;
};

type FinancialProfile = {
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
};

const FinancialDataCollection: React.FC<FinancialDataFormProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    totalDebt: '',
    monthlyDebtPayment: '',
    currentSavings: '',
    monthlySavings: '',
    retirementAge: '',
    retirementSavings: '',
    emergencyFundGoal: '6'
  });

  const steps = [
    {
      id: 'income',
      title: 'Monthly Income',
      description: 'What is your total monthly income after taxes?',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      fields: ['monthlyIncome']
    },
    {
      id: 'expenses',
      title: 'Monthly Expenses',
      description: 'What are your average monthly expenses (rent, utilities, food, etc.)?',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      fields: ['monthlyExpenses']
    },
    {
      id: 'debt',
      title: 'Debt Information',
      description: 'Tell us about your current debt (optional - leave blank if no debt)',
      icon: CreditCard,
      color: 'from-orange-500 to-red-600',
      fields: ['totalDebt', 'monthlyDebtPayment']
    },
    {
      id: 'savings',
      title: 'Savings Details',
      description: 'Your current and monthly savings (optional - enter 0 if just starting)',
      icon: PiggyBank,
      color: 'from-purple-500 to-pink-600',
      fields: ['currentSavings', 'monthlySavings']
    },
    {
      id: 'goals',
      title: 'Financial Goals',
      description: 'Your retirement and emergency fund targets',
      icon: Target,
      color: 'from-indigo-500 to-purple-600',
      fields: ['retirementAge', 'retirementSavings', 'emergencyFundGoal']
    }
  ];

  const calculateMetrics = () => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const debtPayment = parseFloat(formData.monthlyDebtPayment) || 0;
    const savings = parseFloat(formData.monthlySavings) || 0;
    const currentSavings = parseFloat(formData.currentSavings) || 0;

    const dti = income > 0 ? ((debtPayment / income) * 100) : 0;
    const savingsRate = income > 0 ? ((savings / income) * 100) : 0;
    const emergencyFundMonths = expenses > 0 ? (currentSavings / expenses) : 0;
    const netWorthGrowth = currentSavings > 0 ? ((savings / currentSavings) * 100 * 12) : (savings > 0 ? 100 : 0);

    return {
      dti: Math.round(dti * 10) / 10,
      savingsRate: Math.round(savingsRate * 10) / 10,
      emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
      netWorthGrowth: Math.round(netWorthGrowth * 10) / 10
    };
  };

  const handleInputChange = (field: string, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    
    if (currentStep === 2) {
      return currentFields.some(field => {
        const value = formData[field as keyof typeof formData];
        return value !== '';
      });
    }
    
    if (currentStep === 3) {
      return currentFields.some(field => {
        const value = formData[field as keyof typeof formData];
        return value !== '';
      });
    }
    
    return currentFields.every(field => {
      const value = parseFloat(formData[field as keyof typeof formData]);
      return !isNaN(value) && value >= 0;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const metrics = calculateMetrics();
    const profile: FinancialProfile = {
      monthlyIncome: parseFloat(formData.monthlyIncome),
      monthlyExpenses: parseFloat(formData.monthlyExpenses),
      totalDebt: parseFloat(formData.totalDebt) || 0,
      monthlyDebtPayment: parseFloat(formData.monthlyDebtPayment) || 0,
      currentSavings: parseFloat(formData.currentSavings) || 0,
      monthlySavings: parseFloat(formData.monthlySavings) || 0,
      retirementAge: parseFloat(formData.retirementAge),
      retirementSavings: parseFloat(formData.retirementSavings),
      emergencyFundGoal: parseFloat(formData.emergencyFundGoal),
      ...metrics
    };
    onComplete(profile);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const StepIcon = steps[currentStep].icon;

const getFieldConfig = (field: string) => {
  type FieldConfig = {
    label: string;
    placeholder: string;
    info: string;
    prefix?: string;
    suffix?: string;
  };

  const configs: Record<string, FieldConfig> = {
    monthlyIncome: {
      label: 'Monthly Income',
      placeholder: '5000',
      prefix: '$',
      info: 'Your total monthly income after taxes'
    },
    monthlyExpenses: {
      label: 'Monthly Expenses',
      placeholder: '3000',
      prefix: '$',
      info: 'All your monthly living costs'
    },
    totalDebt: {
      label: 'Total Debt (Optional)',
      placeholder: '0',
      prefix: '$',
      info: 'Sum of all debts - enter 0 if none'
    },
    monthlyDebtPayment: {
      label: 'Monthly Debt Payment (Optional)',
      placeholder: '0',
      prefix: '$',
      info: 'Total you pay toward debts - enter 0 if none'
    },
    currentSavings: {
      label: 'Current Savings (Optional)',
      placeholder: '0',
      prefix: '$',
      info: 'Your total savings - enter 0 if just starting'
    },
    monthlySavings: {
      label: 'Monthly Savings (Optional)',
      placeholder: '0',
      prefix: '$',
      info: 'Amount you plan to save monthly - enter 0 if uncertain'
    },
    retirementAge: {
      label: 'Target Retirement Age',
      placeholder: '65',
      suffix: 'years',
      info: 'Age you plan to retire'
    },
    retirementSavings: {
      label: 'Retirement Savings Goal',
      placeholder: '500000',
      prefix: '$',
      info: 'Total amount needed for retirement'
    },
    emergencyFundGoal: {
      label: 'Emergency Fund Goal',
      placeholder: '6',
      suffix: 'months',
      info: 'Months of expenses you want saved'
    }
  };

  return configs[field];
};


  const renderField = (field: string) => {
    const config = getFieldConfig(field);
    if (!config) return null;

    return (
      <div key={field} className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {config.label}
        </label>
        {config.info && (
          <p className="text-xs text-gray-500 mb-3 flex items-start gap-1">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {config.info}
          </p>
        )}
        <div className="relative">
          {config.prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {config.prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={formData[field as keyof typeof formData]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={config.placeholder}
            className={`w-full px-4 py-4 ${config.prefix ? 'pl-8' : ''} ${config.suffix ? 'pr-20' : ''} text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
          />
          {config.suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {config.suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${steps[currentStep].color} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <StepIcon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">Step {currentStep + 1}</div>
                <h2 className="text-3xl font-bold">{steps[currentStep].title}</h2>
              </div>
            </div>
            <p className="text-white/90 text-lg">{steps[currentStep].description}</p>
          </div>

          <div className="p-8">
            {steps[currentStep].fields.map(field => renderField(field))}

            {currentStep === steps.length - 1 && isStepValid() && (
              <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-800">Your Financial Metrics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Debt-to-Income</div>
                    <div className="text-2xl font-bold text-gray-800">{calculateMetrics().dti}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateMetrics().dti > 36 ? '⚠️ High' : calculateMetrics().dti > 28 ? '⚡ Moderate' : '✅ Good'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Savings Rate</div>
                    <div className="text-2xl font-bold text-gray-800">{calculateMetrics().savingsRate}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateMetrics().savingsRate >= 20 ? '✅ Excellent' : calculateMetrics().savingsRate >= 10 ? '⚡ Good' : '⚠️ Low'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Emergency Fund</div>
                    <div className="text-2xl font-bold text-gray-800">{calculateMetrics().emergencyFundMonths.toFixed(1)}m</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateMetrics().emergencyFundMonths >= 6 ? '✅ Strong' : calculateMetrics().emergencyFundMonths >= 3 ? '⚡ Adequate' : '⚠️ Weak'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Net Worth Growth</div>
                    <div className="text-2xl font-bold text-gray-800">{calculateMetrics().netWorthGrowth.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500 mt-1">Per year</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-5 py-3 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-800 transition font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg disabled:shadow-none"
              >
                {currentStep === steps.length - 1 ? 'Complete' : (currentStep === 2 || currentStep === 3) ? 'Next (or Skip)' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {onSkip && (
          <div className="text-center mt-6">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDataCollection;