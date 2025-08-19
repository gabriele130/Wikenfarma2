import React, { useState } from "react";
import ModernSidebar from "./modern-sidebar";
import ModernHeader from "./modern-header";

interface ModernLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function ModernLayout({ children, title, subtitle }: ModernLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.innerWidth < 1024 // Chiusa per default su mobile
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Gestione resize per mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Su desktop, espandi automaticamente se era collassata
        if (sidebarCollapsed && window.innerWidth >= 1024) {
          setSidebarCollapsed(false);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  return (
    <div className="h-screen flex bg-slate-50 relative">
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 flex-shrink-0 relative z-50 lg:relative lg:z-auto ${
        sidebarCollapsed ? 'lg:block' : 'fixed lg:relative inset-y-0 left-0'
      }`}>
        <ModernSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ModernHeader 
          title={title} 
          subtitle={subtitle} 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
        />

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