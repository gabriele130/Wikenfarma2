import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

// Auth
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { ModernLayout } from "./components/layout/modern-layout";

// Pages
import ModernDashboard from "./pages/modern-dashboard";
import AuthPage from "./pages/auth-page";
import CustomersPage from "./pages/customers";
import ProductsPage from "./pages/inventory";
import OrdersPage from "./pages/orders/orders-list";
import OrderDetailsPage from "./pages/orders/order-details";
import NotFoundPage from "./pages/not-found";
import BusinessIntelligencePage from "./pages/business-intelligence";
import SystemPage from "./pages/system";
import AnalyticsPage from "./pages/analytics";
import ReportsPage from "./pages/reports";
import CommissionsPage from "./pages/commissions";
import IntegrationsPage from "./pages/integrations";
import ShippingPage from "./pages/shipping";
import InformatoriPage from "./pages/informatori";
import DoctorsPage from "./pages/doctors";

// Utils
import { queryClient } from "./lib/queryClient";

function ProtectedPageWrapper({ 
  component: Component, 
  title, 
  subtitle 
}: { 
  component: () => React.JSX.Element;
  title?: string;
  subtitle?: string;
}) {
  return (
    <ModernLayout title={title} subtitle={subtitle}>
      <Component />
    </ModernLayout>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  // If user is logged in but on auth page, redirect to dashboard
  useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <Switch>
      <ProtectedRoute 
        path="/" 
        component={() => (
          <ProtectedPageWrapper 
            component={ModernDashboard} 
            title="Dashboard" 
            subtitle="Panoramica sistema WikenFarma" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/customers" 
        component={() => (
          <ProtectedPageWrapper 
            component={CustomersPage} 
            title="Gestione Clienti" 
            subtitle="Farmacie, grossisti e medici" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/inventory" 
        component={() => (
          <ProtectedPageWrapper 
            component={ProductsPage} 
            title="Inventario" 
            subtitle="Gestione prodotti e scorte" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/orders" 
        component={() => (
          <ProtectedPageWrapper 
            component={OrdersPage} 
            title="Ordini" 
            subtitle="Gestione ordini e transazioni" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/orders/:id" 
        component={() => (
          <ProtectedPageWrapper 
            component={OrderDetailsPage} 
            title="Dettaglio Ordine" 
            subtitle="Informazioni complete ordine" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/business-intelligence" 
        component={() => (
          <ProtectedPageWrapper 
            component={BusinessIntelligencePage} 
            title="Business Intelligence" 
            subtitle="Analisi avanzate e insights per il business" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/system" 
        component={() => (
          <ProtectedPageWrapper 
            component={SystemPage} 
            title="Sistema" 
            subtitle="Configurazione e monitoraggio del sistema" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/analytics" 
        component={() => (
          <ProtectedPageWrapper 
            component={AnalyticsPage} 
            title="Analytics" 
            subtitle="Metriche e performance dettagliate" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/reports" 
        component={() => (
          <ProtectedPageWrapper 
            component={ReportsPage} 
            title="Reports" 
            subtitle="Reportistica avanzata e documenti" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/commissions" 
        component={() => (
          <ProtectedPageWrapper 
            component={CommissionsPage} 
            title="Commissioni" 
            subtitle="Calcolo compensi ISF e agenti" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/integrations" 
        component={() => (
          <ProtectedPageWrapper 
            component={IntegrationsPage} 
            title="Integrazioni" 
            subtitle="eBay, GestLine, PharmaEVO" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/shipping" 
        component={() => (
          <ProtectedPageWrapper 
            component={ShippingPage} 
            title="Spedizioni" 
            subtitle="Logistica e tracking" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/informatori" 
        component={() => (
          <ProtectedPageWrapper 
            component={InformatoriPage} 
            title="Informatori" 
            subtitle="Gestione ISF e rappresentanti" 
          />
        )} 
      />
      <ProtectedRoute 
        path="/doctors" 
        component={() => (
          <ProtectedPageWrapper 
            component={DoctorsPage} 
            title="Medici" 
            subtitle="Database medici e specialisti" 
          />
        )} 
      />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AppContent />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;