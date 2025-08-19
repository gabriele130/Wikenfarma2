import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Euro,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Activity,
  PieChart,
  LineChart
} from "lucide-react";

export default function AnalyticsPage() {
  // Demo analytics data
  const analyticsData = {
    totalRevenue: 145820.75,
    revenueGrowth: 12.5,
    totalOrders: 1247,
    orderGrowth: 8.3,
    avgOrderValue: 116.92,
    conversionRate: 3.2,
    topProducts: [
      { name: "Aspirina 500mg", revenue: 15420.50, units: 542, growth: 8.5 },
      { name: "Paracetamolo 1000mg", revenue: 12380.75, units: 489, growth: -2.1 },
      { name: "Omeprazolo 20mg", revenue: 11250.00, units: 375, growth: 15.3 },
      { name: "Amoxicillina 875mg", revenue: 9850.25, units: 328, growth: 5.7 },
      { name: "Ibuprofene 600mg", revenue: 8940.80, units: 298, growth: -5.2 }
    ],
    salesByRegion: [
      { region: "Nord", revenue: 65420.50, orders: 542, growth: 12.3 },
      { region: "Centro", revenue: 48750.25, orders: 398, growth: 8.7 },
      { region: "Sud", revenue: 31650.00, orders: 307, growth: 15.2 }
    ],
    customerSegments: [
      { segment: "Farmacie", count: 156, revenue: 89750.50, avgOrder: 575.32 },
      { segment: "Grossisti", count: 45, revenue: 45230.25, revenue_per_customer: 1005.12 },
      { segment: "Medici", count: 89, revenue: 10840.00, avgOrder: 121.80 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Avanzate</h1>
            <p className="text-indigo-100 text-lg">
              Metriche dettagliate e insights per ottimizzare le performance
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-indigo-200">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Aggiornato in tempo reale</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Periodo: Gennaio 2025</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 block w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna Dati
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 block w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Esporta Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Fatturato Totale</CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(analyticsData.totalRevenue)}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">{formatPercentage(analyticsData.revenueGrowth)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">vs mese precedente</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ordini Totali</CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{analyticsData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">{formatPercentage(analyticsData.orderGrowth)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">ordini processati</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valore Medio Ordine</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(analyticsData.avgOrderValue)}
            </div>
            <p className="text-xs text-slate-500 mt-1">per singolo ordine</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tasso Conversione</CardTitle>
            <Zap className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-slate-500 mt-1">visite → ordini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Performance */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <BarChart3 className="h-5 w-5" />
              <span>Prodotti Top Performance</span>
            </CardTitle>
            <CardDescription>
              I 5 prodotti più venduti per fatturato e volumi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.units} unità vendute</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(product.revenue)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(product.growth)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Region */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <PieChart className="h-5 w-5" />
              <span>Vendite per Regione</span>
            </CardTitle>
            <CardDescription>
              Distribuzione geografica del fatturato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.salesByRegion.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{region.region}</span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(region.revenue)}
                      </p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">{formatPercentage(region.growth)}</span>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(region.revenue / analyticsData.totalRevenue) * 100} 
                    className="h-2" 
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{region.orders} ordini</span>
                    <span>{((region.revenue / analyticsData.totalRevenue) * 100).toFixed(1)}% del totale</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments Analysis */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Users className="h-5 w-5" />
                <span>Analisi Segmenti Clientela</span>
              </CardTitle>
              <CardDescription>
                Performance per tipologia di cliente
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtra
              </Button>
              <Button variant="outline" size="sm">
                <LineChart className="h-4 w-4 mr-2" />
                Grafico
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.customerSegments.map((segment) => (
              <div key={segment.segment} className="p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{segment.segment}</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {segment.count}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Fatturato:</span>
                    <span className="font-semibold">{formatCurrency(segment.revenue)}</span>
                  </div>
                  
                  {segment.avgOrder && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Ordine medio:</span>
                      <span className="font-semibold">{formatCurrency(segment.avgOrder)}</span>
                    </div>
                  )}
                  
                  {segment.revenue_per_customer && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Per cliente:</span>
                      <span className="font-semibold">{formatCurrency(segment.revenue_per_customer)}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Quota fatturato:</span>
                      <span>{((segment.revenue / analyticsData.totalRevenue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Analytics Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Activity className="h-5 w-5" />
              <span>Metriche in Tempo Reale</span>
            </CardTitle>
            <CardDescription>Indicatori live del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Ordini oggi</span>
                <span className="text-lg font-bold text-green-600">24</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Visitatori attivi</span>
                <span className="text-lg font-bold text-blue-600">127</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800">Carrelli aperti</span>
                <span className="text-lg font-bold text-purple-600">43</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Target className="h-5 w-5" />
              <span>Obiettivi Mensili</span>
            </CardTitle>
            <CardDescription>Progressi verso i target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fatturato</span>
                <span>72% (€145k / €200k)</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ordini</span>
                <span>83% (1.247 / 1.500)</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nuovi clienti</span>
                <span>45% (45 / 100)</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Zap className="h-5 w-5" />
              <span>Azioni Rapide</span>
            </CardTitle>
            <CardDescription>Tool di analisi avanzate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard Personalizzato
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="h-4 w-4 mr-2" />
              Analisi Coorte
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <LineChart className="h-4 w-4 mr-2" />
              Trend Forecasting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Avanzato
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}