import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthPopupProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  isLoading?: boolean;
}

// Auth Popup Component
function AuthPopup({ visible, onClose, onLogin, onSignup }: AuthPopupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, user, loginWithPopup, isLoading } = useAuth0();

  if (!visible) {
    return null;
  }

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await loginWithPopup();
      } else {
        await loginWithPopup({
          authorizationParams: { screen_hint: "signup" }
        });
      }
      onClose();
    } catch (err) {
      console.error("Auth0 login/signup error:", err);
    }
  };

  return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Financial Fortress
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            aria-label="Close"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Sign up or login to make your financial plans securely.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

                {/* Toggle */}        
        <p className="mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          {/* <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 ml-1"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button> */}
        </p>

          <button
            onClick={onSignup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Close link */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;

