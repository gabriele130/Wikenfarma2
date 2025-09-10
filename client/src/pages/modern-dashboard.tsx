import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Link } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  Users, 
  BarChart3, 
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
  UserCheck,
  ArrowRight,
  Pill,
  Activity,
  Target,
  Award,
  Zap,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  subtitle 
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'up' | 'down' | 'neutral';
  icon: any;
  subtitle?: string;
}) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-1 mt-1">
            {changeType === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : changeType === 'down' ? (
              <TrendingDown className="h-3 w-3 text-red-600" />
            ) : null}
            <span className={`text-xs ${
              changeType === 'up' ? 'text-green-600' : 
              changeType === 'down' ? 'text-red-600' : 'text-slate-500'
            }`}>
              {changeType === 'up' ? '+' : changeType === 'down' ? '-' : ''}{Math.abs(change)}%
            </span>
          </div>
        )}
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function ModernDashboard() {
  const { user } = useAuth();

  // Fetch dynamic dashboard metrics
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/dashboard/metrics");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes} min fa`;
    if (hours < 24) return `${hours} ore fa`;
    return `${days} giorni fa`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Errore nel caricamento dei dati della dashboard
      </div>
    );
  }

  const stats = {
    totalRevenue: dashboardData?.totalRevenue || 0,
    totalOrders: dashboardData?.totalOrders || 0,
    activeCustomers: dashboardData?.activeCustomers || 0,
    activeProducts: dashboardData?.totalProducts || 0,
    revenueChange: dashboardData?.revenueChange || 0,
    ordersChange: dashboardData?.ordersChange || 0,
    customersChange: dashboardData?.customersChange || 0,
    productsChange: dashboardData?.productsChange || 0,
  };

  const recentOrders = dashboardData?.recentOrders || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const integrationStatus = dashboardData?.integrationStatus || [];
  const topProducts = dashboardData?.topProducts || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completato':
      case 'completed': 
        return 'bg-green-100 text-green-800';
      case 'in attesa':
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      case 'spedito':
      case 'shipped': 
        return 'bg-blue-100 text-blue-800';
      case 'in elaborazione':
      case 'processing': 
        return 'bg-purple-100 text-purple-800';
      default: 
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getIntegrationStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online': 
        return 'bg-green-500';
      case 'warning': 
        return 'bg-yellow-500';
      case 'offline': 
        return 'bg-red-500';
      default: 
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header di benvenuto con gradiente */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Benvenuto, {user?.firstName || 'Utente'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Ecco un riepilogo delle attività odierne
              </p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-blue-200">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            <div className="text-right">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                asChild
              >
                <Link href="/orders/create">
                  <Package className="h-4 w-4 mr-2" />
                  Nuovo Ordine
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Fatturato Totale" 
          value={formatCurrency(stats.totalRevenue)}
          change={Math.abs(stats.revenueChange)}
          changeType={stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral"}
          icon={DollarSign}
          subtitle={`${stats.revenueChange > 0 ? '+' : stats.revenueChange < 0 ? '-' : ''}${Math.abs(stats.revenueChange).toFixed(1)}% dal mese scorso`}
        />
        <StatCard 
          title="Ordini" 
          value={stats.totalOrders.toLocaleString()}
          change={Math.abs(stats.ordersChange)}
          changeType={stats.ordersChange > 0 ? "up" : stats.ordersChange < 0 ? "down" : "neutral"}
          icon={ShoppingCart}
          subtitle={`${stats.ordersChange > 0 ? '+' : stats.ordersChange < 0 ? '-' : ''}${Math.abs(stats.ordersChange).toFixed(1)}% dal mese scorso`}
        />
        <StatCard 
          title="Clienti Attivi" 
          value={stats.activeCustomers.toLocaleString()}
          change={Math.abs(stats.customersChange)}
          changeType={stats.customersChange > 0 ? "up" : stats.customersChange < 0 ? "down" : "neutral"}
          icon={Users}
          subtitle={`${stats.customersChange > 0 ? '+' : stats.customersChange < 0 ? '-' : ''}${Math.abs(stats.customersChange).toFixed(1)}% dal mese scorso`}
        />
        <StatCard 
          title="Prodotti" 
          value={stats.activeProducts.toLocaleString()}
          change={Math.abs(stats.productsChange)}
          changeType={stats.productsChange > 0 ? "up" : stats.productsChange < 0 ? "down" : "neutral"}
          icon={Package}
          subtitle={`${stats.productsChange > 0 ? '+' : stats.productsChange < 0 ? '-' : ''}${Math.abs(stats.productsChange).toFixed(1)}% dal mese scorso`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ordini Recenti */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <ShoppingCart className="h-5 w-5" />
                <span>Ordini Recenti</span>
              </CardTitle>
              <p className="text-sm text-slate-600">Ultimi ordini ricevuti dal sistema</p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">
                  <span className="text-sm">Visualizza tutti</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{order.customerName}</p>
                      <p className="text-sm text-slate-600">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(Number(order.total))}
                    </p>
                    <Badge className={getStatusColor(order.status)} variant="secondary">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nessun ordine recente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attività Recenti */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Activity className="h-5 w-5" />
              <span>Attività Recenti</span>
            </CardTitle>
            <p className="text-sm text-slate-600">Ultime operazioni nel sistema</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.priority === 'high' ? 'bg-red-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'stock' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'shipment' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'customer' && <Users className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'integration' && <Zap className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">{activity.message}</p>
                    <p className="text-xs text-slate-500">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prodotti più venduti */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Award className="h-5 w-5" />
              <span>Prodotti Più Venduti</span>
            </CardTitle>
            <p className="text-sm text-slate-600">Top 5 prodotti per volume di vendita</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product: any, index: number) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.volume} vendite</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Dati prodotti non disponibili</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stato Integrazioni */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Zap className="h-5 w-5" />
              <span>Stato Integrazioni</span>
            </CardTitle>
            <p className="text-sm text-slate-600">Connessioni con sistemi esterni</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationStatus.map((integration: any) => (
                <div key={integration.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getIntegrationStatusColor(integration.status)}`}></div>
                    <div>
                      <p className="font-medium text-slate-800">{integration.name}</p>
                      <p className="text-sm text-slate-500">
                        {integration.status === 'online' ? 'Online' : 
                         integration.status === 'warning' ? 'Attenzione' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {formatRelativeTime(integration.lastSync)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}