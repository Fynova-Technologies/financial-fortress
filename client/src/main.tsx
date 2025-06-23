import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CalculatorProvider } from "@/store/calculator-context";
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-l0cnkmnrn4reomjc.us.auth0.com"
    clientId="01MHsrRBXd0n3ewDmOLdjjqBpbKdpeNV"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <ThemeProvider defaultTheme="light">
      <CalculatorProvider>
        <App />
      </CalculatorProvider>
    </ThemeProvider>
  </Auth0Provider>
);
