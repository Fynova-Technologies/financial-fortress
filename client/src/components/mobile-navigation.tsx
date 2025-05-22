import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { routes } from "@/types";

export function MobileNavigation() {
  const [location] = useLocation();

  // Only show the first 5 menu items in mobile navigation
  const mobileNavItems = routes.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="grid grid-cols-5 h-16">
        {mobileNavItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center",
              location === item.path
                ? "text-primary-500 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400"
            )}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-xs mt-1">{item.mobileLabel || item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
