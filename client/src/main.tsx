import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CalculatorProvider } from "@/store/Calculator/index";
import { Auth0Provider } from '@auth0/auth0-react'
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
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
