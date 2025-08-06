import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CalculatorProvider } from "@/store/calculator-context";
import { Auth0Provider } from '@auth0/auth0-react'
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-l0cnkmnrn4reomjc.us.auth0.com"
    clientId="01MHsrRBXd0n3ewDmOLdjjqBpbKdpeNV"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://financial-fortress/api",
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
