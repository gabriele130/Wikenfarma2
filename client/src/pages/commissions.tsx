import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Commissions() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const { data: commissionsData, isLoading: commissionsLoading } = useQuery({
    queryKey: ["/api/commissions", { page }],
    retry: false,
  });

  const statusColors = {
    pending: "bg-warning bg-opacity-10 text-warning",
    paid: "bg-success bg-opacity-10 text-success",
    cancelled: "bg-error bg-opacity-10 text-error",
  };

  const statusLabels = {
    pending: "In Attesa",
    paid: "Pagata",
    cancelled: "Annullata",
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
        <Header title="Provvigioni" subtitle="Gestione compensi ISF e Wikenship" />
        
        <div className="p-6 space-y-6">
          {/* Commission Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Provvigioni Mese</p>
                  <p className="text-3xl font-bold text-success">€3.240</p>
                  <p className="text-sm text-success">
                    <i className="fas fa-arrow-up mr-1"></i>
                    +15% vs mese scorso
                  </p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-percentage text-success text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Da Pagare</p>
                  <p className="text-3xl font-bold text-warning">€1.850</p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-warning text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bonus ISF</p>
                  <p className="text-3xl font-bold text-info">€890</p>
                </div>
                <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-award text-info text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Punti Wikenship</p>
                  <p className="text-3xl font-bold text-accent">2.450</p>
                </div>
                <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-star text-accent text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Commissions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Gestione Provvigioni</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <i className="fas fa-calculator mr-2"></i>
                    Calcola Compensi
                  </Button>
                  <Button variant="outline">
                    <i className="fas fa-file-export mr-2"></i>
                    Esporta
                  </Button>
                  <Button className="bg-primary hover:bg-blue-700">
                    <i className="fas fa-credit-card mr-2"></i>
                    Processa Pagamenti
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Cerca per ordine o cliente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Filtra per stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tutti gli stati</SelectItem>
                    <SelectItem value="pending">In Attesa</SelectItem>
                    <SelectItem value="paid">Pagata</SelectItem>
                    <SelectItem value="cancelled">Annullata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {commissionsLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Caricamento provvigioni...</p>
                </div>
              ) : !commissionsData?.commissions?.length ? (
                <div className="text-center py-8">
                  <i className="fas fa-percentage text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nessuna provvigione trovata</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ordine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentuale
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Importo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Calcolo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commissionsData.commissions.map((commission) => (
                        <tr key={commission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{commission.orderId?.slice(-8) || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Cliente #{commission.customerId?.slice(-8) || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {commission.percentage ? `${commission.percentage}%` : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              €{parseFloat(commission.amount).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(commission.calculatedAt!).toLocaleDateString("it-IT")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              className={statusColors[commission.status as keyof typeof statusColors] || statusColors.pending}
                            >
                              {statusLabels[commission.status as keyof typeof statusLabels] || commission.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-eye mr-1"></i>
                              Dettagli
                            </Button>
                            {commission.status === "pending" && (
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                <i className="fas fa-check mr-1"></i>
                                Paga
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
