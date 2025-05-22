import { Logo } from "@/components/logo";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <i className="fas fa-bars text-xl"></i>
          </Button>
          <Logo size="md" />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i
              className={`fas ${
                theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"
              }`}
            ></i>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-user-circle text-gray-600 dark:text-gray-300 text-xl"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
