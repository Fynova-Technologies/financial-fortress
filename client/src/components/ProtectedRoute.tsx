import { useAuth0 } from "@auth0/auth0-react";
import { Auth0User } from "@/types/auth";
import { Route, Redirect } from "wouter";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export default function ProtectedRoute({ component: Component, path }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  const authUser = user as Auth0User;

  if (!authUser.email_verified) {
        // Logged in but email not verified → redirect to verify page
    return <Redirect to="/verify" />;
  }

  return <Route path={path} component={Component} />;
}
