import { useState } from "react";
import ModernSidebar from "./modern-sidebar";
import ModernHeader from "./modern-header";

interface ModernLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function ModernLayout({ children, title, subtitle }: ModernLayoutProps) {
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 flex-shrink-0`}>
        <ModernSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ModernHeader title={title} subtitle={subtitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}