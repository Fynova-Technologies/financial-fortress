import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/types";
import { SettingRoutes } from "@/types/settings";
import { useAuth0 } from "@auth0/auth0-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  const menuItems = routes;
  const settingsItems = SettingRoutes;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-20 h-full w-64 transform transition-transform duration-200 ease-in-out",
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <Logo />
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="overflow-y-auto flex-grow p-4">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Calculators
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                      location === item.path
                        ? "bg-gray-50 dark:bg-gray-700 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-gray-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <i className={`fas ${item.icon} mr-3`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Settings
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <i
                      className={cn(
                        "fas mr-3",
                        theme === "dark"
                          ? "fa-sun text-yellow-400"
                          : "fa-moon text-gray-600"
                      )}
                    ></i>
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </li>

                {settingsItems.map((items) => (
                  <li key={items.path}>
                    <Link
                      href={items.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                        location === items.path
                          ? "bg-gray-50 dark:bg-gray-700 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-gray-800"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <i className={`fas ${items.icon} mr-3`}></i>
                      <span>{items.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                <span>Log out</span>
              </button>
            ) : (
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => loginWithRedirect()}
              >
                <i className="fas fa-sign-in-alt mr-3"></i>
                <span>Log in</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}
    </>
  );
}
