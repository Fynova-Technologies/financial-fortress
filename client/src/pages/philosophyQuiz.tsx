import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";
import PhilosophyQuiz from "../components/PhilosophyQuiz"; 

type QuizResult = {
  classification: string;
  primary: string;
  secondary: string;
  scores: Record<string, number>;
  confidence: number;
  completedAt: string;
};

const PhilosophyQuizPage: React.FC = () => {
  const { user } = useAuth0();
  const [, setLocation] = useLocation();

  const handleComplete = (result: QuizResult) => {
    const completedAt = new Date().toISOString();
    const payload = { ...result, completedAt };

    // Save to localStorage with user-specific key
    if (user) {
      localStorage.setItem(`philosophyQuizCompleted_${user.sub}`, 'true');
      localStorage.setItem(`philosophyQuizResult_${user.sub}`, JSON.stringify(payload));
    } else {
      // Guest user fallback
      localStorage.setItem('philosophyQuizCompleted_guest', 'true');
      localStorage.setItem('philosophyQuizResult_guest', JSON.stringify(payload));
    }

    // Clear registration flag
    sessionStorage.removeItem('justRegistered');

    // Navigate to dashboard
    setLocation("/dashboard");
  };

  const handleSkip = () => {
    // Mark as skipped
    if (user) {
      localStorage.setItem(`philosophyQuizCompleted_${user.sub}`, 'skipped');
    } else {
      localStorage.setItem('philosophyQuizCompleted_guest', 'skipped');
    }
    
    sessionStorage.removeItem('justRegistered');
    setLocation("/dashboard");
  };

  // Check if coming from registration
  const isRegistrationFlow = sessionStorage.getItem('justRegistered') === 'true';

  return (
    <PhilosophyQuiz 
      onComplete={handleComplete}
      onSkip={handleSkip}
      showSkipOption={isRegistrationFlow}
    />
  );
};

export default PhilosophyQuizPage;