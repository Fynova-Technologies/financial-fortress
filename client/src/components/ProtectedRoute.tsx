import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route } from "wouter";
import AuthPopup from "./auth/AuthPopup";
import { useState } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export default function ProtectedRoute({
  component: Component,
  path,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(true);

    useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowAuthPopup(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return (
      <>
        {showAuthPopup && (
          <AuthPopup
            visible={showAuthPopup}
            Closeable={false}
            onClose={() => {}}
            onLogin={() => {}}
            onSignup={() => {}}
          />
        )}
      </>
    );
  }
  console.warn("is authenticate", isAuthenticated);

  return <Route path={path} component={Component} />;
}
