import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Euro,
  Eye,
  Filter,
  Search,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ReportsPage() {
  // Demo reports data
  const reportsData = {
    totalReports: 45,
    monthlyReports: 12,
    automatedReports: 8,
    scheduledReports: 5
  };

  const availableReports = [
    {
      id: "1",
      name: "Report Vendite Mensile",
      description: "Analisi dettagliata delle vendite per il mese corrente",
      category: "Vendite",
      lastGenerated: "2025-01-19T10:30:00Z",
      frequency: "Mensile",
      status: "Completato",
      size: "2.4 MB",
      format: "PDF",
      icon: BarChart3,
      color: "blue"
    },
    {
      id: "2",
      name: "Analisi Performance ISF",
      description: "Report dettagliato sulle performance degli informatori scientifici",
      category: "Risorse Umane",
      lastGenerated: "2025-01-18T16:45:00Z", 
      frequency: "Settimanale",
      status: "Completato",
      size: "1.8 MB",
      format: "Excel",
      icon: Users,
      color: "green"
    },
    {
      id: "3",
      name: "Inventario e Scorte",
      description: "Stato attuale dell'inventario con prodotti in esaurimento",
      category: "Magazzino",
      lastGenerated: "2025-01-19T08:15:00Z",
      frequency: "Giornaliero",
      status: "In corso",
      size: "890 KB",
      format: "PDF",
      icon: Package,
      color: "orange"
    },
    {
      id: "4",
      name: "Report Commissioni",
      description: "Calcolo commissioni e incentivi per il team vendite",
      category: "Finance",
      lastGenerated: "2025-01-17T14:20:00Z",
      frequency: "Mensile", 
      status: "Errore",
      size: "1.2 MB",
      format: "Excel",
      icon: Euro,
      color: "red"
    },
    {
      id: "5",
      name: "Analisi Clienti Top",
      description: "Top 50 clienti per fatturato e frequenza ordini",
      category: "Clienti",
      lastGenerated: "2025-01-19T11:00:00Z",
      frequency: "Mensile",
      status: "Completato", 
      size: "3.1 MB",
      format: "PDF",
      icon: TrendingUp,
      color: "purple"
    },
    {
      id: "6",
      name: "Dashboard Esecutivo",
      description: "Panoramica KPI principali per il management",
      category: "Direzione",
      lastGenerated: "2025-01-19T09:30:00Z",
      frequency: "Settimanale",
      status: "Completato",
      size: "567 KB", 
      format: "PDF",
      icon: BarChart3,
      color: "indigo"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completato':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in corso':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'errore':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completato':
        return 'bg-green-100 text-green-800';
      case 'in corso':
        return 'bg-blue-100 text-blue-800';
      case 'errore':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vendite':
        return 'bg-blue-100 text-blue-800';
      case 'risorse umane':
        return 'bg-green-100 text-green-800';
      case 'magazzino':
        return 'bg-orange-100 text-orange-800';
      case 'finance':
        return 'bg-red-100 text-red-800';
      case 'clienti':
        return 'bg-purple-100 text-purple-800';
      case 'direzione':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportistica Avanzata</h1>
            <p className="text-emerald-100 text-lg">
              Genera e gestisci report personalizzati per ogni area aziendale
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-emerald-200">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{reportsData.totalReports} report disponibili</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{reportsData.scheduledReports} programmati</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 block w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configura Report
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 block w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Genera Nuovo
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Report Totali</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{reportsData.totalReports}</div>
            <p className="text-xs text-slate-500 mt-1">Report disponibili</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Questo Mese</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{reportsData.monthlyReports}</div>
            <p className="text-xs text-slate-500 mt-1">Report generati</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Automatizzati</CardTitle>
            <Settings className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{reportsData.automatedReports}</div>
            <p className="text-xs text-slate-500 mt-1">Report automatici</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Programmati</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{reportsData.scheduledReports}</div>
            <p className="text-xs text-slate-500 mt-1">In esecuzione</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <FileText className="h-5 w-5" />
                <span>Report Disponibili</span>
              </CardTitle>
              <CardDescription>
                Genera, scarica e programma i tuoi report aziendali
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtra
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Cerca
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                          <IconComponent className={`h-6 w-6 text-${report.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{report.name}</h3>
                          <Badge className={getCategoryColor(report.category)} variant="secondary">
                            {report.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(report.status)}
                        <Badge className={getStatusColor(report.status)} variant="secondary">
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                    
                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Ultimo aggiornamento:</span>
                        <span>{formatDate(report.lastGenerated)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequenza:</span>
                        <span>{report.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensione:</span>
                        <span>{report.size} • {report.format}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100">
                      <Button size="sm" className="flex-1" disabled={report.status === 'In corso'}>
                        <Download className="h-4 w-4 mr-2" />
                        Scarica
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Anteprima
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <BarChart3 className="h-5 w-5" />
              <span>Report Generati</span>
            </CardTitle>
            <CardDescription>Tipologie di report più utilizzate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vendite</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Magazzino</span>
                <span>25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Finance</span>
                <span>20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clienti</span>
                <span>15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Settings className="h-5 w-5" />
              <span>Configurazioni Rapide</span>
            </CardTitle>
            <CardDescription>Crea nuovi report personalizzati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Report Vendite Personalizzato
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Analisi Team Performance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Report Inventario Avanzato
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard KPI Customizzato
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Calendar className="h-5 w-5" />
              <span>Programmazioni</span>
            </CardTitle>
            <CardDescription>Report automatici programmati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Report Vendite</span>
                <span className="text-xs text-blue-600">Ogni lunedì 09:00</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Inventario</span>
                <span className="text-xs text-green-600">Ogni giorno 08:00</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800">Commissioni</span>
                <span className="text-xs text-purple-600">Primo del mese</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}