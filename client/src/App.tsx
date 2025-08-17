import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

// Auth
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthLayout } from "./components/layout/auth-layout";

// Pages
import DashboardPage from "./pages/dashboard";
import AuthPage from "./pages/auth-page";
import CustomersPage from "./pages/customers";
import ProductsPage from "./pages/inventory";
import OrdersPage from "./pages/orders/orders-list";
import OrderDetailsPage from "./pages/orders/order-details";
import NotFoundPage from "./pages/not-found";

// Utils
import { queryClient } from "./lib/queryClient";

function ProtectedPageWrapper({ component: Component }: { component: () => React.JSX.Element }) {
  return (
    <AuthLayout>
      <Component />
    </AuthLayout>
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
        component={() => <ProtectedPageWrapper component={DashboardPage} />} 
      />
      <ProtectedRoute 
        path="/customers" 
        component={() => <ProtectedPageWrapper component={CustomersPage} />} 
      />
      <ProtectedRoute 
        path="/inventory" 
        component={() => <ProtectedPageWrapper component={ProductsPage} />} 
      />
      <ProtectedRoute 
        path="/orders" 
        component={() => <ProtectedPageWrapper component={OrdersPage} />} 
      />
      <ProtectedRoute 
        path="/orders/:id" 
        component={() => <ProtectedPageWrapper component={OrderDetailsPage} />} 
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