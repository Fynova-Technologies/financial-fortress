import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Only show in development
const DevResetButton: React.FC = () => {
  const { user } = useAuth0();

  // Hide in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const resetOnboarding = () => {
    if (!user?.sub) {
      alert('No user logged in');
      return;
    }

    const confirmed = window.confirm(
      'Reset onboarding? This will clear all onboarding data and reload the page.'
    );

    if (!confirmed) return;

    // Clear all onboarding-related data
    const keys = [
      `financialDataCompleted_${user.sub}`,
      `philosophyQuizCompleted_${user.sub}`,
      `financialData_${user.sub}`,
      `philosophyQuizResult_${user.sub}`,
      `user_first_seen_${user.sub}`,
      `pendingOnboarding_${user.sub}`,
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Removed:', key);
    });

    console.log('✅ Onboarding reset complete - reloading...');
    
    // Reload the page
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <button
      onClick={resetOnboarding}
      className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 transition-colors"
      title="Development only: Reset onboarding flow"
    >
      🔄 Reset Onboarding
    </button>
  );
};

export default DevResetButton;