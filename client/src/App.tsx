import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import OrdersPrivate from "./pages/orders/private";
import Customers from "./pages/customers";
import Doctors from "./pages/doctors";
import Inventory from "./pages/inventory";
import Shipping from "./pages/shipping";
import Commissions from "./pages/commissions";
import Reports from "./pages/reports";
import Integrations from "./pages/integrations";
import Informatori from "./pages/informatori";
import InformatoreDashboard from "./pages/informatore-dashboard";
import Wikenship from "./pages/wikenship";
import Analytics from "./pages/analytics";
import PharmaEvo from "./pages/pharmaevo";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public route for informatore dashboard */}
      <Route path="/informatore/:id" component={InformatoreDashboard} />
      
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/orders/private" component={OrdersPrivate} />
          <Route path="/customers" component={Customers} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/shipping" component={Shipping} />
          <Route path="/commissions" component={Commissions} />
          <Route path="/reports" component={Reports} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/informatori" component={Informatori} />
          <Route path="/wikenship" component={Wikenship} />
          <Route path="/pharmaevo" component={PharmaEvo} />
          <Route path="/analytics" component={Analytics} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
