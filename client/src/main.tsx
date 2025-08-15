import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CalculatorProvider } from "@/store/calculator-context";
import { Auth0Provider } from '@auth0/auth0-react'
import { ToastContainer } from "react-toastify";

console.log(import.meta.env);


console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    // domain={import.meta.env.VITE_AUTH0_DOMAIN || "dev-l0cnkmnrn4reomjc.us.auth0.com"}
    domain="dev-l0cnkmnrn4reomjc.us.auth0.com"
    // clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || "01MHsrRBXd0n3ewDmOLdjjqBpbKdpeNV"}
    clientId="01MHsrRBXd0n3ewDmOLdjjqBpbKdpeNV"
    authorizationParams={{
      redirect_uri: window.location.origin,
      // audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
      audience: "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
      scope: "openid profile email",
    }}
  >
    <ThemeProvider defaultTheme="light">
      <CalculatorProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light" 
        />
      </CalculatorProvider>
    </ThemeProvider>
  </Auth0Provider>
);
