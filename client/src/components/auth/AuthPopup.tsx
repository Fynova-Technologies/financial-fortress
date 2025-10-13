// import React, { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// interface AuthPopupProps {
//   visible: boolean;
//   onClose: () => void;
//   onLogin: () => void;
//   onSignup: () => void;
//   isLoading?: boolean;
//   Closeable?: boolean;
// }

// // Auth Popup Component
// export function AuthPopup({
//   visible,
//   onClose,
//   Closeable = true,
// }: AuthPopupProps) {
//   const [isLogin, setIsLogin] = useState(true);
//   const { isLoading, loginWithPopup } = useAuth0();
//   const [btnLoading, setBtnLoading] = useState(false);

//   if (!visible) {
//     return null;
//   }

//   const handleAuth = async (type: "login" | "signup") => {
//     setBtnLoading(true);
//     try {
//       if (type === "login") {
//         await loginWithPopup(); // normal login
//       } else {
//         await loginWithPopup({
//           authorizationParams: { screen_hint: "signup" },
//         }); // signup
//       }
//       onClose(); // close popup after successful login/signup
//     } catch (err) {
//       console.error("Auth0 login/signup error:", err);
//     } finally {
//       setBtnLoading(false);
//     }
//   };
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-3 sm:mb-4">
//           <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
//             Welcome to Financial Fortress
//           </h2>
//           {Closeable && (
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl sm:text-2xl"
//               aria-label="Close"
//               disabled={isLoading}
//             >
//               ×
//             </button>
//           )}
//         </div>
//         {/* Subtitle */}
//         <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center text-sm sm:text-base">
//           Sign up or login to make your financial plans securely.
//         </p>
//         {/* Action Buttons */}
//         <div className="space-y-2 sm:space-y-3">
//           <button
//             onClick={() => handleAuth("login")}
//             className="w-full mt-3 sm:mt-4 bg-gray-600 text-white py-2 sm:py-2 px-3 sm:px-4 rounded-md hover:bg-gray-700 transition text-sm sm:text-base"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 <span className="text-xs sm:text-sm">Signing In...</span>
//               </div>
//             ) : (
//               "Sign In"
//             )}
//           </button>
//           {/* Toggle */}
//           <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}
//           </p>
//           <button
//             onClick={() => handleAuth("signup")}
//             disabled={isLoading}
//             className="w-full mt-3 sm:mt-4 bg-gray-600 text-white py-2 sm:py-4 px-3 sm:px-4 rounded-md hover:bg-gray-700 transition text-sm sm:text-base"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 <span className="text-xs sm:text-sm">Creating Account...</span>
//               </div>
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </div>
//         {/* Close link */}
//         <div className="mt-4 sm:mt-6 text-center">
//           {Closeable && (
//             <button
//               onClick={onClose}
//               disabled={isLoading}
//               className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50"
//             >
//               Maybe later
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthPopup;






import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthPopupProps {
  visible: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  isLoading?: boolean;
  Closeable?: boolean;
}

export function AuthPopup({
  visible,
  onClose,
  onLogin,
  onSignup,
  Closeable = true,
}: AuthPopupProps) {
  const { isLoading: authLoading, loginWithPopup, loginWithRedirect } = useAuth0();
  const [btnLoading, setBtnLoading] = useState(false);

  const effectiveLoading = authLoading || btnLoading;

  if (!visible) {
    return null;
  }

  const handleAuth = async (type: "login" | "signup") => {
    setBtnLoading(true);
    try {
      // If caller provided handler, use it
      if (type === "login" && typeof onLogin === "function") {
        await onLogin();
        onClose();
        return;
      }
      if (type === "signup" && typeof onSignup === "function") {
        await onSignup();
        onClose();
        return;
      }

      // Fallback: perform internal auth behavior
      if (type === "login") {
        console.log('🔐 AuthPopup: Login with popup');
        await loginWithPopup();
      } else {
        // CRITICAL: Set localStorage flag BEFORE redirect
        console.log('🆕 AuthPopup: Signup initiated - setting temp flag');
        localStorage.setItem('pendingPhilosophyQuiz_temp', 'true');
        console.log('✅ Temp flag set:', localStorage.getItem('pendingPhilosophyQuiz_temp'));
        
        await loginWithRedirect({
          authorizationParams: { 
            screen_hint: "signup" 
          },
          appState: {
            returnTo: window.location.pathname,
          }
        });
      }

      onClose();
    } catch (err) {
      console.error("Auth error (login/signup):", err);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Financial Fortress
          </h2>
          {Closeable && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl sm:text-2xl"
              aria-label="Close"
              disabled={effectiveLoading}
            >
              ×
            </button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center text-sm sm:text-base">
          Sign up or login to make your financial plans securely.
        </p>

        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={() => handleAuth("login")}
            className="w-full mt-3 sm:mt-4 bg-gray-600 text-white py-2 sm:py-2 px-3 sm:px-4 rounded-md hover:bg-gray-700 transition text-sm sm:text-base disabled:opacity-60"
            disabled={effectiveLoading}
          >
            {effectiveLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-xs sm:text-sm">Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-center">
            Don't have an account?
          </p>

          <button
            onClick={() => handleAuth("signup")}
            className="w-full mt-3 sm:mt-4 bg-gray-600 text-white py-2 sm:py-4 px-3 sm:px-4 rounded-md hover:bg-gray-700 transition text-sm sm:text-base disabled:opacity-60"
            disabled={effectiveLoading}
          >
            {effectiveLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-xs sm:text-sm">Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          {Closeable && (
            <button
              onClick={onClose}
              disabled={effectiveLoading}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;