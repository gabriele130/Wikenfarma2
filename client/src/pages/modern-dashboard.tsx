import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Link } from "wouter";
import { useAuth } from "../hooks/use-auth";
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

// Dati realistici per la dashboard
const dashboardData = {
  stats: {
    totalRevenue: 145820.75,
    revenueGrowth: 12.5,
    totalOrders: 1247,
    ordersGrowth: 8.3,
    activeCustomers: 342,
    customersGrowth: 5.7,
    activeProducts: 2156,
    lowStockProducts: 23
  },
  recentOrders: [
    { 
      id: "ORD-2024-001", 
      customer: "Farmacia Centrale Milano", 
      amount: 1245.50, 
      status: "completed",
      date: "2024-01-15",
      items: 8
    },
    { 
      id: "ORD-2024-002", 
      customer: "Dr. Sarah Bianchi", 
      amount: 289.90, 
      status: "pending",
      date: "2024-01-15",
      items: 3
    },
    { 
      id: "ORD-2024-003", 
      customer: "Grossista Pharma Sud", 
      amount: 3450.20, 
      status: "shipped",
      date: "2024-01-14",
      items: 24
    },
    { 
      id: "ORD-2024-004", 
      customer: "Farmacia San Giuseppe", 
      amount: 567.80, 
      status: "processing",
      date: "2024-01-14",
      items: 12
    }
  ],
  topProducts: [
    { name: "Aspirina 500mg", sales: 245, revenue: "€2,450", trend: "up" },
    { name: "Paracetamolo 1000mg", sales: 198, revenue: "€1,980", trend: "up" },
    { name: "Ibuprofene 600mg", sales: 156, revenue: "€1,872", trend: "down" },
    { name: "Omeprazolo 20mg", sales: 134, revenue: "€1,608", trend: "up" },
    { name: "Amoxicillina 875mg", sales: 112, revenue: "€1,344", trend: "stable" }
  ],
  integrations: [
    { name: "GestLine", status: "online", lastSync: "2 min fa", color: "green" },
    { name: "ODOO ERP", status: "online", lastSync: "5 min fa", color: "green" },
    { name: "PharmaEVO", status: "syncing", lastSync: "1 ora fa", color: "yellow" },
    { name: "eBay API", status: "online", lastSync: "10 min fa", color: "green" },
    { name: "WIKENSHIP", status: "offline", lastSync: "3 ore fa", color: "red" }
  ],
  activities: [
    { type: "order", message: "Nuovo ordine #1247 da Farmacia Centrale", time: "2 min fa", icon: ShoppingCart },
    { type: "stock", message: "Stock basso: Aspirina 500mg (12 rimasti)", time: "15 min fa", icon: AlertTriangle },
    { type: "shipment", message: "Spedizione #SP-445 completata", time: "1 ora fa", icon: CheckCircle },
    { type: "customer", message: "Nuovo cliente registrato: Dr. Marco Verdi", time: "2 ore fa", icon: Users },
    { type: "integration", message: "Sincronizzazione ODOO completata", time: "3 ore fa", icon: Zap }
  ]
};

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
            <p className={`text-xs ${
              changeType === 'up' ? 'text-green-600' : 
              changeType === 'down' ? 'text-red-600' : 
              'text-slate-500'
            }`}>
              {change > 0 ? '+' : ''}{change}% {subtitle || 'dal mese scorso'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'completed':
      return { label: 'Completato', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
    case 'pending':
      return { label: 'In attesa', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
    case 'shipped':
      return { label: 'Spedito', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' };
    case 'processing':
      return { label: 'In lavorazione', variant: 'outline' as const, color: 'bg-purple-100 text-purple-800' };
    default:
      return { label: status, variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
  }
}

export default function ModernDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Benvenuto, {user?.firstName}!
            </h1>
            <p className="text-blue-100 text-lg">
              {user?.userType === "informatore" 
                ? "Gestisci i tuoi clienti e commissioni" 
                : "Ecco un riepilogo delle attività odierne"}
            </p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center text-blue-100">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {user?.userType === "informatore" && (
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Informatore Scientifico
                </Badge>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Pill className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Fatturato Totale"
          value={`€${dashboardData.stats.totalRevenue.toLocaleString()}`}
          change={dashboardData.stats.revenueGrowth}
          changeType="up"
          icon={DollarSign}
        />
        <StatCard
          title="Ordini"
          value={dashboardData.stats.totalOrders}
          change={dashboardData.stats.ordersGrowth}
          changeType="up"
          icon={ShoppingCart}
        />
        <StatCard
          title="Clienti Attivi"
          value={dashboardData.stats.activeCustomers}
          change={dashboardData.stats.customersGrowth}
          changeType="up"
          icon={Users}
        />
        <StatCard
          title="Prodotti"
          value={dashboardData.stats.activeProducts}
          change={undefined}
          icon={Package}
          subtitle={`${dashboardData.stats.lowStockProducts} stock basso`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Ordini Recenti</CardTitle>
                  <CardDescription className="text-slate-500">
                    Ultimi ordini ricevuti nel sistema
                  </CardDescription>
                </div>
                <Link to="/orders">
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70">
                    Visualizza tutti
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.recentOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <Link key={order.id} to={`/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer border border-slate-200/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <ShoppingCart className="h-5 w-5 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {order.customer}
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              <p className="text-sm text-slate-500">{order.id}</p>
                              <p className="text-sm text-slate-500">{order.items} articoli</p>
                              <p className="text-sm text-slate-500">{order.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">€{order.amount}</p>
                        </div>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Attività Recenti</CardTitle>
              <CardDescription className="text-slate-500">
                Ultime operazioni nel sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'order' ? 'bg-blue-100' :
                          activity.type === 'stock' ? 'bg-orange-100' :
                          activity.type === 'shipment' ? 'bg-green-100' :
                          activity.type === 'customer' ? 'bg-purple-100' :
                          'bg-slate-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            activity.type === 'order' ? 'text-blue-600' :
                            activity.type === 'stock' ? 'text-orange-600' :
                            activity.type === 'shipment' ? 'text-green-600' :
                            activity.type === 'customer' ? 'text-purple-600' :
                            'text-slate-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Prodotti Più Venduti</CardTitle>
            <CardDescription className="text-slate-500">
              Top 5 prodotti per volume di vendita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-800">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sales} vendite</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {product.revenue}
                    </span>
                    {product.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {product.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Integrations */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Stato Integrazioni</CardTitle>
            <CardDescription className="text-slate-500">
              Connessioni con sistemi esterni
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.color === 'green' ? 'bg-green-500' :
                    integration.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                    <p className="text-xs text-slate-500">Ultima sync: {integration.lastSync}</p>
                  </div>
                </div>
                <Badge 
                  variant={integration.status === 'online' ? 'default' : 'secondary'}
                  className={
                    integration.status === 'online' ? 'bg-green-100 text-green-800 border-green-200' :
                    integration.status === 'syncing' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }
                >
                  {integration.status === 'online' ? 'Online' :
                   integration.status === 'syncing' ? 'Sync' :
                   'Offline'}
                </Badge>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200">
              <Link to="/integrations">
                <Button variant="outline" size="sm" className="w-full bg-white/50 hover:bg-white/70">
                  Gestisci Integrazioni
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}