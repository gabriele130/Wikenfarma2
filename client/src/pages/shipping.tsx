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

export default function Shipping() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const { data: shipmentsData, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["/api/shipments", { page }],
    retry: false,
  });

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    shipped: "bg-info bg-opacity-10 text-info",
    in_transit: "bg-warning bg-opacity-10 text-warning",
    delivered: "bg-success bg-opacity-10 text-success",
  };

  const statusLabels = {
    pending: "In Attesa",
    shipped: "Spedito",
    in_transit: "In Transito",
    delivered: "Consegnato",
  };

  const carrierIcons = {
    GLS: "fas fa-truck",
    Bartolini: "fas fa-shipping-fast",
    Poste: "fas fa-mail-bulk",
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
        <Header title="Spedizioni" subtitle="Gestione spedizioni e tracking" />
        
        <div className="p-6 space-y-6">
          {/* Shipping Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Da Spedire</p>
                  <p className="text-3xl font-bold text-warning">12</p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-warning text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transito</p>
                  <p className="text-3xl font-bold text-info">8</p>
                </div>
                <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-truck text-info text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consegnate Oggi</p>
                  <p className="text-3xl font-bold text-success">24</p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-success text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problemi</p>
                  <p className="text-3xl font-bold text-error">2</p>
                </div>
                <div className="w-12 h-12 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-error text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Shipments Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Gestione Spedizioni</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <i className="fas fa-print mr-2"></i>
                    Stampa Etichette
                  </Button>
                  <Button className="bg-primary hover:bg-blue-700">
                    <i className="fas fa-plus mr-2"></i>
                    Nuova Spedizione
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Cerca per numero tracking o ordine..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Filtra per stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="pending">In Attesa</SelectItem>
                    <SelectItem value="shipped">Spedito</SelectItem>
                    <SelectItem value="in_transit">In Transito</SelectItem>
                    <SelectItem value="delivered">Consegnato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {shipmentsLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Caricamento spedizioni...</p>
                </div>
              ) : !shipmentsData?.shipments?.length ? (
                <div className="text-center py-8">
                  <i className="fas fa-shipping-fast text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nessuna spedizione trovata</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ordine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Corriere
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Spedizione
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
                      {shipmentsData.shipments.map((shipment) => (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {shipment.trackingNumber || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Ordine #{shipment.orderId?.slice(-8) || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className={`${carrierIcons[shipment.carrier as keyof typeof carrierIcons] || 'fas fa-truck'} text-gray-400 mr-2`}></i>
                              <span className="text-sm text-gray-900">
                                {shipment.carrier || "Non specificato"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.shippingDate 
                              ? new Date(shipment.shippingDate).toLocaleDateString("it-IT")
                              : "Non spedito"
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              className={statusColors[shipment.status as keyof typeof statusColors] || statusColors.pending}
                            >
                              {statusLabels[shipment.status as keyof typeof statusLabels] || shipment.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-search mr-1"></i>
                              Tracking
                            </Button>
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-print mr-1"></i>
                              Etichetta
                            </Button>
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
