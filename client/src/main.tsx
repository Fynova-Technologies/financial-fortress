import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CalculatorProvider } from "@/store/calculator-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <CalculatorProvider>
      <App />
    </CalculatorProvider>
  </ThemeProvider>
);
