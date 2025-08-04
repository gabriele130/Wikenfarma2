import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricCard from "@/components/dashboard/metric-card";
import RecentOrders from "@/components/dashboard/recent-orders";
import ActivityFeed from "@/components/dashboard/activity-feed";
import SystemStatus from "@/components/dashboard/system-status";
import QuickActions from "@/components/dashboard/quick-actions";
import NotificationsPanel from "@/components/dashboard/notifications-panel";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Non autorizzato",
        description: "Stai per essere reindirizzato alla pagina di accesso...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["/api/orders/recent"],
    retry: false,
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["/api/activity-logs"],
    retry: false,
  });

  const { data: integrations } = useQuery({
    queryKey: ["/api/integrations"],
    retry: false,
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/products/low-stock"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-pills text-white text-2xl"></i>
          </div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Dashboard" subtitle="Panoramica generale del sistema" />
        
        <div className="p-6 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Ordini Oggi"
              value={metrics?.todaysOrders?.toString() || "0"}
              change="+12% da ieri"
              changeType="positive"
              icon="fas fa-shopping-cart"
              color="primary"
              isLoading={metricsLoading}
            />
            <MetricCard
              title="Fatturato Mensile"
              value={`€${parseFloat(metrics?.monthlyRevenue || "0").toLocaleString()}`}
              change="+8.5% dal mese scorso"
              changeType="positive"
              icon="fas fa-euro-sign"
              color="secondary"
              isLoading={metricsLoading}
            />
            <MetricCard
              title="Clienti Attivi"
              value={metrics?.activeCustomers?.toString() || "0"}
              change="+24 questo mese"
              changeType="positive"
              icon="fas fa-users"
              color="info"
              isLoading={metricsLoading}
            />
            <MetricCard
              title="Spedizioni Pending"
              value={metrics?.pendingShipments?.toString() || "0"}
              change="Da processare"
              changeType="neutral"
              icon="fas fa-truck"
              color="warning"
              isLoading={metricsLoading}
            />
          </div>

          {/* Recent Orders and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders orders={recentOrders || []} />
            <ActivityFeed activities={activityLogs || []} />
          </div>

          {/* System Status and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SystemStatus integrations={integrations || []} />
            <QuickActions />
            <NotificationsPanel lowStockProducts={lowStockProducts || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
