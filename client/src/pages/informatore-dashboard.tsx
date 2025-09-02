import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";
import { 
  useMyCompensation, 
  useMyCommissionLogs, 
  useMyDoctorCards, 
  useMyPerformance 
} from "../hooks/use-compensations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Euro, 
  TrendingUp,
  Calendar,
  Eye,
  Search,
  Filter,
  FileText,
  Share2,
  MapPin,
  Phone,
  Mail,
  Building2,
  User,
  Clock,
  Target
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function InformatoreDashboard() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("compensation");

  // Solo per informatori autenticati
  if (!user || user.userType !== 'informatore') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accesso Riservato</h2>
            <p className="text-slate-600">Questa sezione è riservata agli Informatori Scientifici del Farmaco.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hook per i dati dell'informatore
  const { data: myCompensation, isLoading: compensationLoading } = useMyCompensation(selectedMonth, selectedYear);
  const { data: commissionLogs, isLoading: logsLoading } = useMyCommissionLogs({
    month: selectedMonth,
    year: selectedYear,
    search: searchQuery
  });
  const { data: doctorCards, isLoading: doctorCardsLoading } = useMyDoctorCards();
  const { data: performance, isLoading: performanceLoading } = useMyPerformance(selectedYear);

  // Formatta i valori in euro per il display
  const formatEuro = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(num || 0);
  };

  // Alias per compatibilità con il codice esistente
  const formatCurrency = formatEuro;
  const statsLoading = performanceLoading;
  const cardsLoading = doctorCardsLoading;
  const performanceStats = performance;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
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

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'iqvia': return 'IQVIA/PharmaEVO';
      case 'wikenship': return 'WIKENSHIP';
      case 'gestline': return 'GestLine';
      case 'direct_sales': return 'Vendite Dirette';
      default: return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'iqvia': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'wikenship': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'gestline': return 'bg-green-100 text-green-700 border-green-200';
      case 'direct_sales': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard ISF</h1>
              <p className="text-indigo-100 text-lg">
                Benvenuto, {user.firstName} {user.lastName}
              </p>
              <p className="text-indigo-200 text-sm">
                Utente: {user.userType || "Non specificato"}
              </p>
            </div>
            <div className="text-right">
              <div className="flex space-x-2">
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
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
                  <SelectTrigger className="w-24 bg-white/20 border-white/30 text-white">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="compensation">Il Mio Compenso</TabsTrigger>
            <TabsTrigger value="logs">Log Provvigioni</TabsTrigger>
            <TabsTrigger value="doctors">Le Mie Schede</TabsTrigger>
          </TabsList>

          {/* Tab: Compenso */}
          <TabsContent value="compensation" className="space-y-6">
            {user.userType === 'informatore' ? (
              // Dashboard per Liberi Professionisti
              <>
                {/* Riepilogo Compenso */}
                {compensationLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : myCompensation ? (
                  <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Euro className="h-5 w-5" />
                        <span>Compenso {months.find(m => m.value === selectedMonth)?.label} {selectedYear}</span>
                      </CardTitle>
                      <CardDescription>
                        Dettaglio completo del calcolo delle provvigioni
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Riepilogo Importi */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-4">Compensi Base</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Fisso Mensile:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.fixedSalary))}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Provv. IQVIA:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.iqviaCommission))}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Provv. WIKENSHIP:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.wikentshipCommission))}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Vendite Dirette:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.directSalesCommission))}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                            <h3 className="font-semibold text-green-900 mb-4">Bonus & Penalità</h3>
                            <div className="space-y-3">
                              {Number(myCompensation.performanceBonus) > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">Bonus Performance (5%+):</span>
                                  <span className="font-semibold text-green-600">+{formatCurrency(Number(myCompensation.performanceBonus))}</span>
                                </div>
                              )}
                              {Number(myCompensation.visitPenalty) > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">Penalità Visite:</span>
                                  <span className="font-semibold text-red-600">-{formatCurrency(Number(myCompensation.visitPenalty))}</span>
                                </div>
                              )}
                              {Number(myCompensation.cutOffReduction) > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">Cut-off Applicato:</span>
                                  <span className="font-semibold text-red-600">-{formatCurrency(Number(myCompensation.cutOffReduction))}</span>
                                </div>
                              )}
                              {Number(myCompensation.teamCommission) > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">Provv. Capo Area:</span>
                                  <span className="font-semibold text-purple-600">+{formatCurrency(Number(myCompensation.teamCommission))}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Totale e Metriche */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
                            <h3 className="font-semibold text-purple-900 mb-4">Totali</h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-600">Totale Lordo:</span>
                                <span className="font-bold text-slate-800">{formatCurrency(Number(myCompensation.totalGross))}</span>
                              </div>
                              <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-600">Totale Netto:</span>
                                <span className="font-bold text-green-600">{formatCurrency(Number(myCompensation.totalNet))}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100">
                            <h3 className="font-semibold text-orange-900 mb-4">Performance</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Fatturato Mensile:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.totalSales))}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Visite Effettuate:</span>
                                <span className="font-semibold">{myCompensation.monthlyVisits}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Media 12 Mesi:</span>
                                <span className="font-semibold">{formatCurrency(Number(myCompensation.avgSalesLast12Months))}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={myCompensation.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                             myCompensation.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                             'bg-blue-100 text-blue-700'} variant="secondary">
                              {myCompensation.status === 'approved' ? 'Approvato' :
                               myCompensation.status === 'paid' ? 'Pagato' :
                               myCompensation.status === 'calculated' ? 'Calcolato' : 'In Elaborazione'}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              Calcolato il {formatDate(myCompensation.calculatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                    <CardContent className="text-center py-12">
                      <Euro className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nessun Compenso Disponibile</h3>
                      <p className="text-slate-500">
                        Il compenso per {months.find(m => m.value === selectedMonth)?.label} {selectedYear} non è ancora stato calcolato.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              // Dashboard per Dipendenti - Solo visualizzazione dati
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance {months.find(m => m.value === selectedMonth)?.label} {selectedYear}</span>
                  </CardTitle>
                  <CardDescription>
                    Riepilogo dei dati di vendita e performance (dipendenti non ricevono provvigioni)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Fatturato IQVIA</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {performanceStats?.iqviaSales ? formatCurrency(performanceStats.iqviaSales) : '€0.00'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                        <h3 className="font-semibold text-green-900 mb-2">Vendite WIKENSHIP</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {performanceStats?.wikentshipSales ? formatCurrency(performanceStats.wikentshipSales) : '€0.00'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100">
                        <h3 className="font-semibold text-orange-900 mb-2">Vendite Dirette</h3>
                        <p className="text-2xl font-bold text-orange-600">
                          {performanceStats?.directSales ? formatCurrency(performanceStats.directSales) : '€0.00'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Log Provvigioni */}
          <TabsContent value="logs" className="space-y-6">
            {user.userType === 'informatore' && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Dettaglio Provvigioni</span>
                      </CardTitle>
                      <CardDescription>
                        Log completo degli ordini che hanno generato provvigioni (esclusi dati IQVIA)
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Cerca ordini..."
                          className="pl-10 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtra
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {logsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !commissionLogs || commissionLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Nessun log di provvigioni trovato per il periodo selezionato</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data Ordine</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fonte</TableHead>
                          <TableHead className="text-right">Importo Ordine</TableHead>
                          <TableHead className="text-right">% Prov.</TableHead>
                          <TableHead className="text-right">Provvigione</TableHead>
                          <TableHead className="text-center">Cut-off</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commissionLogs.map((log: any) => (
                          <TableRow key={log.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">
                              {formatDate(log.orderDate)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{log.customerName}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {log.customerType === 'pharmacy' ? 'Farmacia' : 'Privato'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getSourceColor(log.source)} variant="outline">
                                {getSourceLabel(log.source)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(Number(log.orderAmount))}
                            </TableCell>
                            <TableCell className="text-right">
                              {Number(log.commissionRate).toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {formatCurrency(Number(log.commissionAmount))}
                            </TableCell>
                            <TableCell className="text-center">
                              {log.cutOffApplied ? (
                                <Badge className="bg-red-100 text-red-700" variant="outline">
                                  -{formatCurrency(Number(log.cutOffAmount))}
                                </Badge>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}

            {user.userType !== 'informatore' && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
                <CardContent className="text-center py-12">
                  <Euro className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sezione Non Disponibile</h3>
                  <p className="text-slate-500">
                    I dipendenti non ricevono provvigioni e quindi non hanno accesso ai log dettagliati.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Schede Medico */}
          <TabsContent value="doctors" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>Le Mie Schede Medico</span>
                    </CardTitle>
                    <CardDescription>
                      Schede medico/farmacia assegnate (visualizzazione e condivisione, non modificabili)
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Cerca schede..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {cardsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !doctorCards || doctorCards.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Nessuna scheda medico assegnata</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctorCards.map((card: any) => (
                      <Card key={card.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800">{card.facilityName}</h3>
                                <p className="text-sm text-slate-500">{card.facilityType}</p>
                              </div>
                            </div>
                            <Badge className={card.importance === 'high' ? 'bg-red-100 text-red-700' :
                                             card.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                             'bg-green-100 text-green-700'} variant="outline">
                              {card.importance === 'high' ? 'Alta' :
                               card.importance === 'medium' ? 'Media' : 'Bassa'}
                            </Badge>
                          </div>

                          {card.doctorName && (
                            <div className="mb-3">
                              <p className="font-medium text-slate-700">{card.doctorName}</p>
                              {card.specialization && (
                                <p className="text-sm text-slate-500">{card.specialization}</p>
                              )}
                            </div>
                          )}

                          <div className="space-y-2 text-sm">
                            {card.phone && (
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Phone className="h-4 w-4" />
                                <span>{card.phone}</span>
                              </div>
                            )}
                            {card.email && (
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Mail className="h-4 w-4" />
                                <span>{card.email}</span>
                              </div>
                            )}
                            {card.address && (
                              <div className="flex items-center space-x-2 text-slate-600">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{card.city}, {card.province}</span>
                              </div>
                            )}
                          </div>

                          {card.lastVisitDate && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1 text-slate-500">
                                  <Clock className="h-4 w-4" />
                                  <span>Ultima visita:</span>
                                </div>
                                <span className="font-medium">{formatDate(card.lastVisitDate)}</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizza
                            </Button>
                            {card.isShared && (
                              <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}