import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNavigation } from "@/components/mobile-navigation";
import { AuthSync } from "@/components/auth/AuthSync";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <AuthSync/>
      <MobileHeader onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen pb-16 lg:pb-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
