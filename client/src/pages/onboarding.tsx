import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import PhilosophyQuiz from "@/components/PhilosophyQuiz";
import FinancialDataCollection from "@/components/FinancialDataCollection";

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

type QuizResult = {
  classification: string;
  primary: string;
  secondary: string;
  scores: Record<string, number>;
  confidence: number;
  completedAt: string;
};

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth0();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<'loading' | 'financial' | 'quiz'>('loading');

  useEffect(() => {
    if (!user) {
      setLocation('/');
      return;
    }

    const financialDataKey = `financialDataCompleted_${user.sub}`;
    const quizKey = `philosophyQuizCompleted_${user.sub}`;

    const hasFinancialData = localStorage.getItem(financialDataKey) === 'true';
    const hasCompletedQuiz = localStorage.getItem(quizKey) === 'true';

    console.log('📊 Onboarding Status:', { hasFinancialData, hasCompletedQuiz });

    if (!hasFinancialData) {
      setCurrentStep('financial');
    } else if (!hasCompletedQuiz) {
      setCurrentStep('quiz');
    } else {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleFinancialComplete = (data: FinancialProfile) => {
    console.log('✅ Financial data collected:', data);
    
    if (user) {
      localStorage.setItem(`financialDataCompleted_${user.sub}`, 'true');
      localStorage.setItem(`financialData_${user.sub}`, JSON.stringify(data));
    }

    setCurrentStep('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log('✅ Quiz completed:', result);
    
    if (user) {
      localStorage.setItem(`philosophyQuizCompleted_${user.sub}`, 'true');
      localStorage.setItem(`philosophyQuizResult_${user.sub}`, JSON.stringify(result));
    }

    setLocation('/dashboard');
  };

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (currentStep === 'financial') {
    return <FinancialDataCollection onComplete={handleFinancialComplete} />;
  }

  if (currentStep === 'quiz') {
    return <PhilosophyQuiz onComplete={handleQuizComplete} />;
  }

  return null;
};

export default OnboardingFlow;