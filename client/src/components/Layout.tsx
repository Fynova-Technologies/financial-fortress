import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [currentPath] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Budget Planner", href: "/budget-planner", icon: "fa-solid fa-wallet" },
    { name: "Mortgage Calculator", href: "/mortgage-calculator", icon: "fa-solid fa-home" },
    { name: "EMI Calculator", href: "/emi-calculator", icon: "fa-solid fa-calculator" },
    { name: "Retirement Planner", href: "/retirement-planner", icon: "fa-solid fa-chart-line" },
    { name: "Salary Manager", href: "/salary-manager", icon: "fa-solid fa-money-check-alt" },
    { name: "ROI Calculator", href: "/roi-calculator", icon: "fa-solid fa-chart-pie" },
    { name: "Currency Converter", href: "/currency-converter", icon: "fa-solid fa-money-bill" },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:gap-1" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <i className={`${item.icon} text-sm`} aria-hidden="true"></i>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t bg-card md:hidden" aria-label="Mobile navigation">
            <div className="container mx-auto space-y-1 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <i className={`${item.icon} text-sm`} aria-hidden="true"></i>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
