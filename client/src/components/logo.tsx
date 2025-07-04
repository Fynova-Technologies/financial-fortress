import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <i className="fas fa-calculator text-primary text-xl"></i>
      <h1 className={cn("font-bold text-primary-600 dark:text-primary-400", sizeClasses[size])}>
        FinCalc Pro
      </h1>
    </div>
  );
}
