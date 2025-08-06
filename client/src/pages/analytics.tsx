import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users,
  Euro,
  Calendar,
  Target
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  growthRate: number;
  topProducts: Array<{ code: string; revenue: number; count: number }>;
  periodComparison: {
    current: { revenue: number; orders: number };
    previous: { revenue: number; orders: number };
    growth: number;
  };
}

interface TopPerformer {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: number;
  type: "informatore" | "product" | "doctor";
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedInformatore, setSelectedInformatore] = useState<string>("all");
  const [comparisonEnabled, setComparisonEnabled] = useState(true);

  const { data: revenueData, isLoading: loadingRevenue } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/revenue', selectedInformatore, selectedPeriod, comparisonEnabled],
  });

  const { data: topPerformers, isLoading: loadingPerformers } = useQuery<TopPerformer[]>({
    queryKey: ['/api/analytics/top-performers', selectedPeriod, 'revenue', 10],
  });

  const { data: growthData, isLoading: loadingGrowth } = useQuery<any[]>({
    queryKey: ['/api/analytics/growth', selectedPeriod, 'revenue'],
  });

  const formatCurrency = (value: number) => `€${value.toLocaleString('it-IT')}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  if (loadingRevenue || loadingPerformers || loadingGrowth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">Caricamento analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Analytics" subtitle="Analisi avanzate fatturato e performance ISF" />
        
        <div className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Mese Corrente</SelectItem>
                <SelectItem value="last-month">Mese Precedente</SelectItem>
                <SelectItem value="current-quarter">Quadrimestre Corrente</SelectItem>
                <SelectItem value="current-year">Anno Corrente</SelectItem>
                <SelectItem value="last-year">Anno Precedente</SelectItem>
                <SelectItem value="all-time">Sempre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedInformatore} onValueChange={setSelectedInformatore}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Informatore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli ISF</SelectItem>
                <SelectItem value="mario-rossi">Mario Rossi</SelectItem>
                <SelectItem value="giulia-bianchi">Giulia Bianchi</SelectItem>
                <SelectItem value="luca-verdi">Luca Verdi</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={comparisonEnabled ? "default" : "outline"}
              onClick={() => setComparisonEnabled(!comparisonEnabled)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Confronto Periodi
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Fatturato Totale
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(revenueData?.totalRevenue || 0)}
                  </span>
                  {revenueData?.periodComparison && (
                    <Badge variant={revenueData.periodComparison.growth > 0 ? "default" : "destructive"}>
                      {revenueData.periodComparison.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {formatPercentage(revenueData.periodComparison.growth)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Ordini
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{revenueData?.orderCount || 0}</span>
                  {revenueData?.periodComparison && (
                    <Badge variant="secondary">
                      {revenueData.periodComparison.current.orders} vs {revenueData.periodComparison.previous.orders}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Scontrino Medio
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(revenueData?.averageOrderValue || 0)}
                  </span>
                  <Badge variant="outline">
                    Media
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Crescita
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {formatPercentage(revenueData?.growthRate || 0)}
                  </span>
                  <Badge variant={
                    (revenueData?.growthRate || 0) >= 5 ? "default" :
                    (revenueData?.growthRate || 0) > 0 ? "secondary" :
                    "destructive"
                  }>
                    {(revenueData?.growthRate || 0) >= 5 && (
                      <>
                        <Target className="w-3 h-3 mr-1" />
                        Bonus 100€
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="revenue-analysis" className="space-y-6">
            <TabsList>
              <TabsTrigger value="revenue-analysis">Analisi Fatturato</TabsTrigger>
              <TabsTrigger value="product-performance">Performance Prodotti</TabsTrigger>
              <TabsTrigger value="isf-comparison">Confronto ISF</TabsTrigger>
              <TabsTrigger value="growth-trends">Trend Crescita</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue-analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fatturato per Codice</CardTitle>
                    <CardDescription>
                      I 10 prodotti più venduti nel periodo selezionato
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData?.topProducts || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="code" />
                        <YAxis tickFormatter={(value) => `€${value}`} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Fatturato"]} />
                        <Bar dataKey="revenue" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      I migliori ISF per fatturato del periodo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformers?.slice(0, 5).map((performer, index) => (
                        <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{performer.name}</p>
                              <p className="text-sm text-gray-600">{performer.orders} ordini</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(performer.revenue)}</p>
                            <Badge variant={performer.growth > 0 ? "default" : "destructive"} className="text-xs">
                              {formatPercentage(performer.growth)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="product-performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Prodotti</CardTitle>
                  <CardDescription>
                    Analisi dettagliata vendite per singolo codice prodotto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={revenueData?.topProducts || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ code, value }) => `${code}: €${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {(revenueData?.topProducts || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Fatturato"]} />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Codici Alto-Fatturanti</h3>
                      {revenueData?.topProducts?.slice(0, 8).map((product, index) => (
                        <div key={product.code} className="flex justify-between items-center p-2 border rounded">
                          <span className="font-mono text-sm">{product.code}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                            <div className="text-xs text-gray-600">{product.count} ordini</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="isf-comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Confronto ISF</CardTitle>
                  <CardDescription>
                    Comparazione performance tra informatori scientifici
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topPerformers?.filter(p => p.type === "informatore") || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Fatturato"]} />
                      <Bar dataKey="revenue" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth-trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trend di Crescita</CardTitle>
                  <CardDescription>
                    Andamento fatturato negli ultimi 12 mesi con confronti temporali
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={growthData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Fatturato"]} />
                      <Line type="monotone" dataKey="current" stroke="#0088FE" strokeWidth={2} name="Periodo Corrente" />
                      <Line type="monotone" dataKey="previous" stroke="#FF8042" strokeWidth={2} name="Periodo Precedente" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Codici in Crescita (Mese)
                    </CardTitle>
                    <div className="text-2xl font-bold text-green-600">12</div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Codici in Calo (Mese)
                    </CardTitle>
                    <div className="text-2xl font-bold text-red-600">3</div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      All-Time Peak
                    </CardTitle>
                    <div className="text-2xl font-bold">€47,892</div>
                    <div className="text-xs text-gray-600">Marzo 2024</div>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}