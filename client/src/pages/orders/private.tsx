import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import OrderModal from "@/components/modals/order-modal";

export default function OrdersPrivate() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

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

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders", { page, customerType: "private", status: statusFilter }],
    retry: false,
  });

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    confirmed: "bg-success bg-opacity-10 text-success",
    processing: "bg-warning bg-opacity-10 text-warning",
    shipped: "bg-info bg-opacity-10 text-info",
    delivered: "bg-success bg-opacity-10 text-success",
    cancelled: "bg-error bg-opacity-10 text-error",
  };

  const statusLabels = {
    pending: "In Attesa",
    confirmed: "Confermato",
    processing: "In Lavorazione",
    shipped: "Spedito",
    delivered: "Consegnato",
    cancelled: "Annullato",
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
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header title="Ordini Privati" subtitle="Gestione ordini clienti privati" />
          
          <div className="p-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Ordini Clienti Privati</CardTitle>
                  <Button 
                    onClick={() => setShowOrderModal(true)}
                    className="bg-primary hover:bg-blue-700"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Nuovo Ordine
                  </Button>
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Input
                    placeholder="Cerca per numero ordine o cliente..."
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
                      <SelectItem value="confirmed">Confermato</SelectItem>
                      <SelectItem value="processing">In Lavorazione</SelectItem>
                      <SelectItem value="shipped">Spedito</SelectItem>
                      <SelectItem value="delivered">Consegnato</SelectItem>
                      <SelectItem value="cancelled">Annullato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">Caricamento ordini...</p>
                  </div>
                ) : !ordersData?.orders?.length ? (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Nessun ordine trovato</p>
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
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stato
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Importo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ordersData.orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {order.orderNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {order.customer?.firstName && order.customer?.lastName
                                  ? `${order.customer.firstName} ${order.customer.lastName}`
                                  : order.customer?.companyName || "Cliente sconosciuto"
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.orderDate!).toLocaleDateString("it-IT")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                className={statusColors[order.status as keyof typeof statusColors] || statusColors.pending}
                              >
                                {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              €{parseFloat(order.total).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button variant="ghost" size="sm">
                                <i className="fas fa-eye mr-1"></i>
                                Dettagli
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

      <OrderModal 
        open={showOrderModal} 
        onOpenChange={setShowOrderModal}
      />
    </>
  );
}
