import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Euro,
  Target,
  Award,
  Calendar,
  FileText,
  Download,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit
} from "lucide-react";

export default function CommissionsPage() {
  // Fetch commission data
  const { data: commissionsData, isLoading } = useQuery({
    queryKey: ['/api/commissions'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commissions");
      if (!response.ok) {
        throw new Error("Failed to fetch commissions");
      }
      return response.json();
    },
  });

  // Demo data for ISF commissions
  const commissionStats = {
    totalCommissions: 18750.50,
    monthlyGrowth: 8.2,
    activeISF: 12,
    avgCommissionPerISF: 1562.54,
    topPerformer: "Marco Rossi",
    topPerformerAmount: 3420.75
  };

  const recentCommissions = [
    {
      id: "1",
      isfName: "Marco Rossi",
      period: "Gennaio 2025",
      baseCommission: 2400.00,
      bonuses: 1020.75,
      total: 3420.75,
      status: "Pagata",
      orders: 45,
      revenue: 28500.00
    },
    {
      id: "2", 
      isfName: "Giulia Verdi",
      period: "Gennaio 2025",
      baseCommission: 1800.00,
      bonuses: 650.00,
      total: 2450.00,
      status: "In elaborazione",
      orders: 32,
      revenue: 21200.00
    },
    {
      id: "3",
      isfName: "Antonio Bianchi",
      period: "Gennaio 2025", 
      baseCommission: 1950.00,
      bonuses: 425.50,
      total: 2375.50,
      status: "Approvata",
      orders: 38,
      revenue: 24800.00
    },
    {
      id: "4",
      isfName: "Sara Neri",
      period: "Gennaio 2025",
      baseCommission: 1650.00,
      bonuses: 380.00,
      total: 2030.00,
      status: "In elaborazione",
      orders: 28,
      revenue: 19600.00
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagata': return 'bg-green-100 text-green-800';
      case 'approvata': return 'bg-blue-100 text-blue-800';
      case 'in elaborazione': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestione Commissioni ISF</h1>
            <p className="text-purple-100 text-lg">
              Calcolo e monitoraggio compensi per informatori scientifici
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-purple-200">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Periodo: Gennaio 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{commissionStats.activeISF} ISF attivi</span>
              </div>
            </div>
          </div>
          <div className="text-right">
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Commissioni Totali</CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(commissionStats.totalCommissions)}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">+{commissionStats.monthlyGrowth}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Gennaio 2025</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ISF Attivi</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{commissionStats.activeISF}</div>
            <p className="text-xs text-slate-500 mt-1">Informatori attivi</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Media per ISF</CardTitle>
            <Calculator className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(commissionStats.avgCommissionPerISF)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Commissione media</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900">{commissionStats.topPerformer}</div>
            <div className="text-sm font-semibold text-green-600">
              {formatCurrency(commissionStats.topPerformerAmount)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Miglior performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Calculator className="h-5 w-5" />
                <span>Commissioni per ISF</span>
              </CardTitle>
              <CardDescription>
                Dettaglio commissioni e bonus per ogni informatore scientifico
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">ISF</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Periodo</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Base</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Bonus</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Totale</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Ordini</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {recentCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {commission.isfName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{commission.isfName}</p>
                          <p className="text-xs text-slate-500">
                            Fatturato: {formatCurrency(commission.revenue)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{commission.period}</td>
                    <td className="py-4 px-4 text-right font-medium text-slate-800">
                      {formatCurrency(commission.baseCommission)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-green-600">
                      +{formatCurrency(commission.bonuses)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(commission.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusColor(commission.status)} variant="secondary">
                        {commission.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {commission.orders}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Calculation Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Target className="h-5 w-5" />
              <span>Metodo di Calcolo</span>
            </CardTitle>
            <CardDescription>
              Come vengono calcolate le commissioni ISF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Commissione Base</h4>
              <p className="text-sm text-blue-700">
                2.5% sul fatturato generato dai clienti assegnati
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Bonus Obiettivo</h4>
              <p className="text-sm text-green-700">
                +1.5% se raggiungi il 110% dell'obiettivo mensile
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Bonus Fedeltà</h4>
              <p className="text-sm text-purple-700">
                +0.5% per ogni anno di collaborazione (max 5 anni)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <FileText className="h-5 w-5" />
              <span>Report Disponibili</span>
            </CardTitle>
            <CardDescription>
              Scarica report dettagliati delle commissioni
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Report Commissioni Mensili
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Analisi Performance ISF
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Riepilogo Bonus e Incentivi
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Storico Pagamenti
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}