import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Activity,
  Zap,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Dati realistici per Business Intelligence
const biData = {
  kpis: [
    { 
      title: "Revenue Totale", 
      value: "€345,678", 
      change: 15.8, 
      trend: "up",
      icon: DollarSign,
      period: "vs mese scorso" 
    },
    { 
      title: "Crescita Mensile", 
      value: "12.5%", 
      change: 2.3, 
      trend: "up",
      icon: TrendingUp,
      period: "media ultimi 6 mesi" 
    },
    { 
      title: "Clienti Attivi", 
      value: "1,247", 
      change: -3.2, 
      trend: "down",
      icon: Users,
      period: "questo mese" 
    },
    { 
      title: "Ordine Medio", 
      value: "€156.90", 
      change: 8.7, 
      trend: "up",
      icon: Target,
      period: "ultimi 30 giorni" 
    }
  ],
  revenueByMonth: [
    { month: "Gen", revenue: 285000, orders: 892, growth: 8.2 },
    { month: "Feb", revenue: 298000, orders: 945, growth: 4.6 },
    { month: "Mar", revenue: 312000, orders: 1034, growth: 4.7 },
    { month: "Apr", revenue: 289000, orders: 967, growth: -7.4 },
    { month: "Mag", revenue: 334000, orders: 1123, growth: 15.6 },
    { month: "Giu", revenue: 345678, orders: 1247, growth: 3.5 }
  ],
  topProducts: [
    { name: "Aspirina 500mg", revenue: 45000, units: 2340, growth: 12.5, margin: 35.2 },
    { name: "Paracetamolo 1000mg", revenue: 38000, units: 1890, growth: 8.9, margin: 42.1 },
    { name: "Ibuprofene 600mg", revenue: 32000, units: 1567, growth: -4.3, margin: 38.7 },
    { name: "Omeprazolo 20mg", revenue: 28500, units: 1234, growth: 18.2, margin: 45.8 },
    { name: "Amoxicillina 875mg", revenue: 25000, units: 1089, growth: 6.7, margin: 33.4 }
  ],
  customerSegments: [
    { segment: "Farmacie", value: 145000, percentage: 42, color: "#3B82F6" },
    { segment: "Grossisti", value: 98000, percentage: 28, color: "#10B981" },
    { segment: "Medici Privati", value: 67000, percentage: 19, color: "#F59E0B" },
    { segment: "Privati", value: 35678, percentage: 11, color: "#EF4444" }
  ],
  informatoriPerformance: [
    { 
      name: "Mario Rossi", 
      revenue: 89450, 
      orders: 145, 
      growth: 12.5, 
      efficiency: 92,
      commission: 4472,
      status: "superstar" 
    },
    { 
      name: "Giulia Bianchi", 
      revenue: 67230, 
      orders: 89, 
      growth: 8.9, 
      efficiency: 85,
      commission: 3361,
      status: "excellent" 
    },
    { 
      name: "Luca Verdi", 
      revenue: 54890, 
      orders: 76, 
      growth: -2.1, 
      efficiency: 78,
      commission: 2744,
      status: "good" 
    },
    { 
      name: "Sofia Ferrari", 
      revenue: 78920, 
      orders: 98, 
      growth: 15.8, 
      efficiency: 89,
      commission: 3946,
      status: "rising" 
    }
  ],
  alerts: [
    { 
      type: "warning", 
      message: "Stock basso per Aspirina 500mg (23 unità rimaste)", 
      priority: "high",
      time: "15 min fa" 
    },
    { 
      type: "success", 
      message: "Obiettivo mensile raggiunto con 5 giorni di anticipo", 
      priority: "medium",
      time: "2 ore fa" 
    },
    { 
      type: "info", 
      message: "Nuovo cliente premium registrato: Farmacia Centrale Roma", 
      priority: "low",
      time: "1 giorno fa" 
    }
  ]
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

function KPICard({ title, value, change, trend, icon: Icon, period }: any) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center space-x-2 mt-1">
          <div className={`flex items-center space-x-1 ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Activity className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-slate-500">{period}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BusinessIntelligencePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Intelligence</h1>
          <p className="text-sm text-slate-600">Analisi avanzate e insights per il business</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="text-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            <Download className="h-4 w-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {biData.kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Trend Revenue & Ordini</CardTitle>
            <CardDescription>Andamento mensile degli ultimi 6 mesi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={biData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `€${value?.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Ordini'
                  ]}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Prodotti</CardTitle>
            <CardDescription>Performance per revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {biData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">€{product.revenue?.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{product.units} unità</span>
                  </div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  product.growth >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Segmenti Clienti</CardTitle>
            <CardDescription>Distribuzione revenue per tipo cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={biData.customerSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {biData.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${value?.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {biData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-xs text-slate-600 truncate">{segment.segment}</span>
                  <span className="text-xs font-medium text-slate-900">{segment.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ISF Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance ISF</CardTitle>
            <CardDescription>Classifica informatori questo mese</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {biData.informatoriPerformance.map((isf, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{isf.name}</p>
                    <p className="text-xs text-slate-500">€{isf.revenue?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                    isf.growth >= 10 ? 'bg-green-100 text-green-700' :
                    isf.growth >= 5 ? 'bg-blue-100 text-blue-700' :
                    isf.growth >= 0 ? 'bg-slate-100 text-slate-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {isf.growth >= 0 ? '+' : ''}{isf.growth}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alert & Notifiche</CardTitle>
          <CardDescription>Avvisi automatici dal sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {biData.alerts.map((alert, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'success' ? 'bg-green-50 border-green-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className={`flex-shrink-0 mt-1 ${
                  alert.type === 'warning' ? 'text-yellow-600' :
                  alert.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`}>
                  {alert.type === 'warning' ? <Activity className="h-4 w-4" /> :
                   alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                   <Eye className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {alert.priority === 'high' ? 'Alta' : 
                   alert.priority === 'medium' ? 'Media' : 'Bassa'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}