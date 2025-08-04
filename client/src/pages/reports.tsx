import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("sales");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Non autorizzato",
        description: "Stai per essere reindirizzato alla pagina di accesso...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  const reportTypes = [
    { value: "sales", label: "Report Vendite", icon: "fas fa-chart-line" },
    { value: "customers", label: "Report Clienti", icon: "fas fa-users" },
    { value: "inventory", label: "Report Magazzino", icon: "fas fa-boxes" },
    { value: "commissions", label: "Report Provvigioni", icon: "fas fa-percentage" },
    { value: "shipping", label: "Report Spedizioni", icon: "fas fa-truck" },
    { value: "financial", label: "Report Finanziario", icon: "fas fa-euro-sign" },
  ];

  const periods = [
    { value: "week", label: "Ultima Settimana" },
    { value: "month", label: "Ultimo Mese" },
    { value: "quarter", label: "Ultimo Trimestre" },
    { value: "year", label: "Ultimo Anno" },
    { value: "custom", label: "Periodo Personalizzato" },
  ];

  const generateReport = () => {
    toast({
      title: "Report in generazione",
      description: "Il report verrà generato e sarà disponibile per il download a breve.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-pills text-white text-2xl"></i>
          </div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Report" subtitle="Reportistica avanzata e analisi" />
        
        <div className="p-6 space-y-6">
          {/* Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generatore Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Report
                  </label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <i className={`${type.icon} mr-2`}></i>
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Periodo
                  </label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona periodo" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={generateReport}
                    className="w-full bg-primary hover:bg-blue-700"
                  >
                    <i className="fas fa-file-download mr-2"></i>
                    Genera Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendite Totali</p>
                  <p className="text-3xl font-bold text-success">
                    €{parseFloat(metrics?.monthlyRevenue || "0").toLocaleString()}
                  </p>
                  <p className="text-sm text-success">
                    <i className="fas fa-arrow-up mr-1"></i>
                    +8.5% vs mese scorso
                  </p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-success text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ordini Elaborati</p>
                  <p className="text-3xl font-bold text-info">
                    {metrics?.todaysOrders || 0}
                  </p>
                  <p className="text-sm text-info">
                    <i className="fas fa-calendar mr-1"></i>
                    Oggi
                  </p>
                </div>
                <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shopping-cart text-info text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clienti Attivi</p>
                  <p className="text-3xl font-bold text-primary">
                    {metrics?.activeCustomers || 0}
                  </p>
                  <p className="text-sm text-primary">
                    <i className="fas fa-users mr-1"></i>
                    Totali
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-primary text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spedizioni</p>
                  <p className="text-3xl font-bold text-warning">
                    {metrics?.pendingShipments || 0}
                  </p>
                  <p className="text-sm text-warning">
                    <i className="fas fa-clock mr-1"></i>
                    In attesa
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-truck text-warning text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Available Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Report Disponibili</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((report) => (
                  <div key={report.value} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                          <i className={`${report.icon} text-primary`}></i>
                        </div>
                        <h3 className="font-medium text-gray-900">{report.label}</h3>
                      </div>
                      <Badge variant="outline">Disponibile</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Analisi dettagliata e metriche per {report.label.toLowerCase()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <i className="fas fa-eye mr-1"></i>
                        Anteprima
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-blue-700">
                        <i className="fas fa-download mr-1"></i>
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Report Recenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <i className="fas fa-file-chart-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-4">Nessun report generato di recente</p>
                <p className="text-sm text-gray-400">
                  I report generati verranno mostrati qui per un facile accesso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
