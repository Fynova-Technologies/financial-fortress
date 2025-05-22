import { useContext } from "react";
import { ThemeProviderContext } from "@/components/theme-provider";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    isDarkMode: context.theme === "dark",
    isLightMode: context.theme === "light",
    toggleTheme: () => {
      context.setTheme(context.theme === "dark" ? "light" : "dark");
    }
  };
};
