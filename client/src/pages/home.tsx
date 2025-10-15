import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Shield } from "lucide-react";

const Home = () => {
  const navigate = useLocation()[1];
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    // Wait for auth to complete
    if (isLoading) return;

    // Only proceed if authenticated
    if (!isAuthenticated || !user) return;

    const userId = user.sub;
    
    // Check if user has completed onboarding using user-specific keys
    const hasFinancialData = localStorage.getItem(`financialDataCompleted_${userId}`) === 'true';
    const hasCompletedQuiz = localStorage.getItem(`philosophyQuizCompleted_${userId}`) === 'true';

    // If user has completed both parts of onboarding, redirect to dashboard
    if (hasFinancialData && hasCompletedQuiz) {
      console.log('✅ User has completed onboarding, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    // Check if user clicked "Get Started" before authentication
    const pendingStart = localStorage.getItem('pendingOnboardingStart');
    if (pendingStart === 'true') {
      console.log('🎯 User returned from auth - starting onboarding flow');
      
      // Clear the flag
      localStorage.removeItem('pendingOnboardingStart');
      
      // Mark that user has visited home
      localStorage.setItem(`hasVisitedHome_${userId}`, 'true');
      
      // Navigate directly to onboarding
      navigate('/onboarding');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const startOnboarding = async () => {
    // If user is not authenticated, trigger login/signup first
    if (!isAuthenticated) {
      console.log('🔐 User not authenticated - redirecting to Auth0 signup');
      
      // Set a temporary flag to indicate user clicked "Get Started" before auth
      localStorage.setItem('pendingOnboardingStart', 'true');
      
      try {
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: "signup" // Show signup form by default
          },
          appState: {
            returnTo: "/", // Return to home after authentication
            startOnboarding: true, // Flag to start onboarding after auth
          }
        });
      } catch (error) {
        console.error('Authentication error:', error);
      }
      return;
    }
    
    // User is authenticated - mark that user has visited home (critical for onboarding flow)
    if (user?.sub) {
      console.log('✅ Marking home page as visited for user:', user.sub);
      localStorage.setItem(`hasVisitedHome_${user.sub}`, 'true');
    }
    
    // Navigate to onboarding
    navigate('/onboarding');
  };

  const viewDashboard = () => {
    navigate('/dashboard');
  };

  // Check if user has completed onboarding (using user-specific keys)
  const hasCompletedOnboarding = 
    user?.sub &&
    localStorage.getItem(`financialDataCompleted_${user.sub}`) === 'true' && 
    localStorage.getItem(`philosophyQuizCompleted_${user.sub}`) === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Wellness
              </span>
              <br />
              Made Simple
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover your financial philosophy, track your progress, and achieve your goals with personalized insights.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4 flex gap-4 justify-center">
            {hasCompletedOnboarding ? (
              <Button 
                size="lg" 
                onClick={viewDashboard}
                className="text-lg px-8 py-6 shadow-elevated hover:shadow-xl transition-all"
              >
                View Dashboard
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={startOnboarding}
                disabled={isLoading}
                className="text-lg px-8 py-6 shadow-elevated hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Get Started"
                )}
              </Button>
            )}
          </div>

          {/* Show hint for non-authenticated users */}
          {!isAuthenticated && !isLoading && (
            <p className="text-sm text-muted-foreground">
              Click "Get Started" to create your account and begin your financial journey
            </p>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Find Your Philosophy</h3>
              <p className="text-sm text-muted-foreground">
                Take our quiz to discover your unique financial mindset and approach.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Your Health</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your financial health score and see your progress over time.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Personalized Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get tailored recommendations based on your goals and philosophy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;