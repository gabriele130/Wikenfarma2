import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  useCompensations, 
  useCompensationStats, 
  useCalculateCompensations 
} from "../hooks/use-compensations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Users, 
  Calculator,
  Search,
  Filter,
  Plus,
  Euro,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function CommissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedInformatore, setSelectedInformatore] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch informatori per filtri
  const { data: informatori = [] } = useQuery({
    queryKey: ["/api/informatori"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/informatori");
      return response.json();
    },
  });

  // Fetch compensations data
  const { data: compensationsData, isLoading } = useQuery({
    queryKey: ["/api/compensations", selectedMonth, selectedYear, selectedInformatore, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("month", selectedMonth.toString());
      params.set("year", selectedYear.toString());
      if (selectedInformatore !== "all") params.set("informatoreId", selectedInformatore);
      if (selectedType !== "all") params.set("type", selectedType);
      
      const response = await apiRequest("GET", `/api/compensations?${params}`);
      return response.json();
    },
  });

  // Statistiche riepilogative
  const { data: compensationStats = {
    totalCompensations: 0,
    totalDipendenti: 0,
    totalLiberiProfessionisti: 0,
    pendingApprovals: 0,
    avgCompensation: 0,
    monthlyGrowth: 0
  } } = useQuery({
    queryKey: ["/api/compensations/stats", selectedMonth, selectedYear],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/compensations/stats?month=${selectedMonth}&year=${selectedYear}`);
      return response.json();
    },
  });

  const compensations = compensationsData?.compensations || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'calculated': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'calculated': return <Calculator className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'draft': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Calculate compensation using the new hook
  const calculateCompensationMutation = useCalculateCompensations();

  const handleCalculateCompensations = () => {
    calculateCompensationMutation.mutate({
      month: selectedMonth,
      year: selectedYear,
      informatoreId: selectedInformatore !== "all" ? selectedInformatore : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sistema Compensi ISF</h1>
              <p className="text-blue-100 text-lg">
                Gestione completa dei compensi per Informatori Scientifici del Farmaco
              </p>
            </div>
            <div className="text-right">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={handleCalculateCompensations}
                disabled={calculateCompensationMutation.isPending}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {calculateCompensationMutation.isPending ? "Calcolando..." : "Calcola Compensi"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Compensi Totali</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(compensationStats.totalCompensations)}
                  </p>
                </div>
                <Euro className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dipendenti</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.totalDipendenti}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Liberi Prof.</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.totalLiberiProfessionisti}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Attesa</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Media</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(compensationStats.avgCompensation)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Crescita</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{compensationStats.monthlyGrowth}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-slate-800">Filtri Compensi</CardTitle>
                <CardDescription>Filtra i compensi per periodo e informatore</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-40">
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

                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
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

                <Select value={selectedInformatore} onValueChange={setSelectedInformatore}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tutti gli informatori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli informatori</SelectItem>
                    {informatori.map((inf: any) => (
                      <SelectItem key={inf.id} value={inf.id}>
                        {inf.firstName} {inf.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    <SelectItem value="dipendente">Dipendenti</SelectItem>
                    <SelectItem value="libero_professionista">Liberi Professionisti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Compensations Table */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-slate-800">Compensi Mensili</CardTitle>
                <CardDescription>
                  Elenco dei compensi per {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Esporta Excel
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Report PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : compensations.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nessun compenso trovato per i filtri selezionati</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Calcola Compensi
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Informatore</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Livello</TableHead>
                    <TableHead className="text-right">Fisso</TableHead>
                    <TableHead className="text-right">Provvigioni</TableHead>
                    <TableHead className="text-right">Bonus</TableHead>
                    <TableHead className="text-right">Totale Lordo</TableHead>
                    <TableHead className="text-center">Stato</TableHead>
                    <TableHead className="text-center">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compensations.map((comp: any) => (
                    <TableRow key={comp.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                            {comp.informatore?.firstName?.charAt(0)}{comp.informatore?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {comp.informatore?.firstName} {comp.informatore?.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{comp.informatore?.area}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {comp.informatore?.type === 'dipendente' ? 'Dipendente' : 'Lib. Prof.'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={comp.informatore?.level === 'capo_area' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}>
                          {comp.informatore?.level === 'capo_area' ? 'Capo Area' : 'Informatore'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(comp.fixedSalary) || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          <div>IQVIA: {formatCurrency(Number(comp.iqviaCommission) || 0)}</div>
                          <div>WIKENSHIP: {formatCurrency(Number(comp.wikentshipCommission) || 0)}</div>
                          <div>Dirette: {formatCurrency(Number(comp.directSalesCommission) || 0)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          {Number(comp.performanceBonus) > 0 && (
                            <div className="text-green-600">+{formatCurrency(Number(comp.performanceBonus))}</div>
                          )}
                          {Number(comp.visitPenalty) > 0 && (
                            <div className="text-red-600">-{formatCurrency(Number(comp.visitPenalty))}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        {formatCurrency(Number(comp.totalGross))}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusColor(comp.status)} variant="secondary">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(comp.status)}
                            <span>
                              {comp.status === 'approved' ? 'Approvato' :
                               comp.status === 'calculated' ? 'Calcolato' :
                               comp.status === 'paid' ? 'Pagato' :
                               comp.status === 'draft' ? 'Bozza' : 'N/A'}
                            </span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizza Dettagli
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Log Provvigioni
                            </DropdownMenuItem>
                            {comp.status === 'calculated' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approva
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifica
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}