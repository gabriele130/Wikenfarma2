import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useAuth } from "../hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Search,
  Filter,
  Euro,
  Award,
  Target,
  Users,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Download,
  GitCompare
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
export default function AnalyticsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor((new Date().getMonth()) / 3) + 1);
  const [selectedCodeFilter, setSelectedCodeFilter] = useState<string>("all");
  const [selectedISFFilter, setSelectedISFFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_month");

  // Get user permissions
  const isAdmin = user?.userType === 'admin';
  const isAreaManager = user?.userType === 'area_manager'; 
  const isISF = user?.userType === 'informatore';

  // Fetch analytics data based on user role
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: [
      "/api/analytics/revenue", 
      selectedPeriod, 
      selectedMonth, 
      selectedYear, 
      selectedQuarter,
      selectedCodeFilter,
      selectedISFFilter,
      user?.id
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("period", selectedPeriod);
      params.set("month", selectedMonth.toString());
      params.set("year", selectedYear.toString());
      params.set("quarter", selectedQuarter.toString());
      
      if (selectedCodeFilter !== "all") params.set("productCode", selectedCodeFilter);
      if (selectedISFFilter !== "all") params.set("isfId", selectedISFFilter);
      if (isISF) params.set("myData", "true"); // ISF vede solo i propri dati

      const response = await apiRequest("GET", `/api/analytics/revenue?${params}`);
      return response.json();
    },
  });

  // Fetch product codes for filters
  const { data: productCodes = [] } = useQuery({
    queryKey: ["/api/analytics/product-codes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/analytics/product-codes");
      return response.json();
    },
  });

  // Fetch ISF list for filters (only for admin and area managers)
  const { data: isfList = [] } = useQuery({
    queryKey: ["/api/informatori/list"],
    queryFn: async () => {
      if (isISF) return []; // ISF non vede lista altri ISF
      const response = await apiRequest("GET", "/api/informatori");
      return response.json();
    },
    enabled: !isISF,
  });

  // Fetch comparison data
  const { data: comparisonData } = useQuery({
    queryKey: [
      "/api/analytics/comparison",
      selectedPeriod,
      comparisonPeriod,
      selectedMonth,
      selectedYear,
      selectedCodeFilter,
      selectedISFFilter
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("currentPeriod", selectedPeriod);
      params.set("comparisonPeriod", comparisonPeriod);
      params.set("month", selectedMonth.toString());
      params.set("year", selectedYear.toString());
      
      if (selectedCodeFilter !== "all") params.set("productCode", selectedCodeFilter);
      if (selectedISFFilter !== "all") params.set("isfId", selectedISFFilter);
      if (isISF) params.set("myData", "true");

      const response = await apiRequest("GET", `/api/analytics/comparison?${params}`);
      return response.json();
    },
  });

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage helper  
  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return '0.0%';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Get trend icon
  const getTrendIcon = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return <Minus className="h-4 w-4 text-gray-400" />;
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  // Get trend color
  const getTrendColor = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return "text-gray-400";
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-400";
  };

  const months = [
    { value: 1, label: "Gennaio" },
    { value: 2, label: "Febbraio" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Aprile" },
    { value: 5, label: "Maggio" },
    { value: 6, label: "Giugno" },
    { value: 7, label: "Luglio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Settembre" },
    { value: 10, label: "Ottobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Dicembre" },
  ];

  const quarters = [
    { value: 1, label: "Q1 (Gen-Mar)" },
    { value: 2, label: "Q2 (Apr-Giu)" },
    { value: 3, label: "Q3 (Lug-Set)" },
    { value: 4, label: "Q4 (Ott-Dic)" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Default analytics data structure
  const analytics = analyticsData || {
    totalRevenue: 0,
    revenueChange: 0,
    topProducts: [],
    topISF: [],
    productTrends: [],
    monthlyTrends: [],
    quarterlyTrends: [],
    allTimeStats: {
      maxRevenue: 0,
      minRevenue: 0,
      avgRevenue: 0,
      totalOrders: 0
    }
  };

  const comparison = comparisonData || {
    revenueChange: 0,
    topGrowthProducts: [],
    topDeclineProducts: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Fatturato</h1>
              <p className="text-emerald-100 text-lg">
                {isISF ? "Le tue performance di vendita" : 
                 isAreaManager ? "Performance della tua area" : 
                 "Analytics complete sistema ISF"}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Esporta Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Period and Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mensile</SelectItem>
                  <SelectItem value="quarter">Quadrimestrale</SelectItem>
                  <SelectItem value="year">Annuale</SelectItem>
                  <SelectItem value="alltime">All Time</SelectItem>
                </SelectContent>
              </Select>

              {selectedPeriod === "month" && (
                <>
                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {selectedPeriod === "quarter" && (
                <Select value={selectedQuarter.toString()} onValueChange={(value) => setSelectedQuarter(parseInt(value))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {quarters.map((quarter) => (
                      <SelectItem key={quarter.value} value={quarter.value.toString()}>
                        {quarter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCodeFilter} onValueChange={setSelectedCodeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtra per codice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i codici</SelectItem>
                  {productCodes.map((code: any) => (
                    <SelectItem key={code.id} value={code.code}>
                      {code.name} ({code.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!isISF && (
                <Select value={selectedISFFilter} onValueChange={setSelectedISFFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtra per ISF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli ISF</SelectItem>
                    {isfList.map((isf: any) => (
                      <SelectItem key={isf.id} value={isf.id}>
                        {isf.firstName} {isf.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-5">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="products">Prodotti</TabsTrigger>
            <TabsTrigger value="isf">Performance ISF</TabsTrigger>
            <TabsTrigger value="trends">Trend</TabsTrigger>
            <TabsTrigger value="comparison">Confronti</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Fatturato Totale</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(analytics.totalRevenue)}
                      </p>
                      <div className="flex items-center mt-1">
                        {getTrendIcon(analytics.revenueChange)}
                        <span className={`text-sm ml-1 ${getTrendColor(analytics.revenueChange)}`}>
                          {formatPercentage(analytics.revenueChange)}
                        </span>
                      </div>
                    </div>
                    <Euro className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Picco Massimo</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(analytics.allTimeStats?.maxRevenue || 0)}
                      </p>
                      <p className="text-sm text-slate-500">All time</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Picco Minimo</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(analytics.allTimeStats?.minRevenue || 0)}
                      </p>
                      <p className="text-sm text-slate-500">All time</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Media Periodo</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(analytics.allTimeStats?.avgRevenue || 0)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {analytics.allTimeStats?.totalOrders || 0} ordini
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products and ISF */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Codici Alto-Fatturanti</span>
                  </CardTitle>
                  <CardDescription>
                    Prodotti con maggior fatturato nel periodo selezionato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analytics.topProducts?.slice(0, 5).map((product: any, index: number) => (
                        <div key={product.code} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.code}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(product.revenue)}</p>
                            <div className="flex items-center">
                              {getTrendIcon(product.change)}
                              <span className={`text-sm ml-1 ${getTrendColor(product.change)}`}>
                                {formatPercentage(product.change)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {!isISF && (
                <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Top Performer ISF</span>
                    </CardTitle>
                    <CardDescription>
                      ISF con miglior performance nel periodo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analyticsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analytics.topISF?.slice(0, 5).map((isf: any, index: number) => (
                          <div key={isf.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant="outline" 
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  index === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' : ''
                                }`}
                              >
                                {index === 0 ? <Award className="h-4 w-4" /> : index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium">{isf.firstName} {isf.lastName}</p>
                                <p className="text-sm text-gray-500">{isf.area}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(isf.revenue)}</p>
                              <div className="flex items-center">
                                {getTrendIcon(isf.change)}
                                <span className={`text-sm ml-1 ${getTrendColor(isf.change)}`}>
                                  {formatPercentage(isf.change)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardHeader>
                <CardTitle>Fatturato per Codice Prodotto</CardTitle>
                <CardDescription>
                  Analisi dettagliata del fatturato per ogni codice prodotto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cerca codici prodotto..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codice</TableHead>
                        <TableHead>Nome Prodotto</TableHead>
                        <TableHead>Fatturato {selectedPeriod === "month" ? "Mensile" : selectedPeriod === "quarter" ? "Quadrimestrale" : "Annuale"}</TableHead>
                        <TableHead>Variazione</TableHead>
                        <TableHead>Picco Max</TableHead>
                        <TableHead>Picco Min</TableHead>
                        <TableHead className="text-right">Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.topProducts?.map((product: any) => (
                        <TableRow key={product.code}>
                          <TableCell className="font-mono">{product.code}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{formatCurrency(product.revenue)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTrendIcon(product.change)}
                              <span className={`ml-1 ${getTrendColor(product.change)}`}>
                                {formatPercentage(product.change)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.maxRevenue || 0)}</TableCell>
                          <TableCell>{formatCurrency(product.minRevenue || 0)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ISF Performance Tab */}
          <TabsContent value="isf" className="space-y-6">
            {!isISF ? (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle>Performance ISF</CardTitle>
                  <CardDescription>
                    Fatturato e performance degli Informatori Scientifici del Farmaco
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ISF</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Fatturato Totale</TableHead>
                        <TableHead>Variazione</TableHead>
                        <TableHead>Picco Max</TableHead>
                        <TableHead>Picco Min</TableHead>
                        <TableHead>Ordini</TableHead>
                        <TableHead className="text-right">Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.topISF?.map((isf: any) => (
                        <TableRow key={isf.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{isf.firstName} {isf.lastName}</p>
                              <p className="text-sm text-gray-500">{isf.userType === 'employee' ? 'Dipendente' : 'Libero Prof.'}</p>
                            </div>
                          </TableCell>
                          <TableCell>{isf.area}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(isf.revenue)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTrendIcon(isf.change)}
                              <span className={`ml-1 ${getTrendColor(isf.change)}`}>
                                {formatPercentage(isf.change)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(isf.maxRevenue || 0)}</TableCell>
                          <TableCell>{formatCurrency(isf.minRevenue || 0)}</TableCell>
                          <TableCell>{isf.totalOrders || 0}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle>Le Tue Performance</CardTitle>
                  <CardDescription>
                    Il tuo fatturato e le tue performance nel periodo selezionato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        {formatCurrency(analytics.totalRevenue)}
                      </div>
                      <p className="text-gray-600">Fatturato Totale</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {analytics.allTimeStats?.totalOrders || 0}
                      </div>
                      <p className="text-gray-600">Ordini Processati</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {formatCurrency(analytics.allTimeStats?.avgRevenue || 0)}
                      </div>
                      <p className="text-gray-600">Media per Ordine</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle>Codici in Crescita</CardTitle>
                  <CardDescription>
                    Prodotti con maggior crescita nel periodo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparison.topGrowthProducts?.slice(0, 5).map((product: any, index: number) => (
                      <div key={product.code} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatPercentage(product.growth)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(product.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle>Codici in Calo</CardTitle>
                  <CardDescription>
                    Prodotti con maggior calo nel periodo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparison.topDeclineProducts?.slice(0, 5).map((product: any, index: number) => (
                      <div key={product.code} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            {formatPercentage(product.decline)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(product.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GitCompare className="h-5 w-5" />
                  <span>Confronto Periodi</span>
                </CardTitle>
                <CardDescription>
                  Confronta i risultati tra diversi periodi di tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Periodo di Confronto
                    </label>
                    <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="previous_month">Mese Precedente</SelectItem>
                        <SelectItem value="previous_quarter">Quadrimestre Precedente</SelectItem>
                        <SelectItem value="previous_year">Anno Precedente</SelectItem>
                        <SelectItem value="same_month_previous_year">Stesso Mese Anno Scorso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(analytics.totalRevenue)}
                    </div>
                    <p className="text-gray-600">Periodo Corrente</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-600 mb-2">
                      {formatCurrency(comparisonData?.previousRevenue || 0)}
                    </div>
                    <p className="text-gray-600">Periodo Confronto</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold mb-2 ${getTrendColor(comparison.revenueChange)}`}>
                      {formatPercentage(comparison.revenueChange)}
                    </div>
                    <p className="text-gray-600">Variazione</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}