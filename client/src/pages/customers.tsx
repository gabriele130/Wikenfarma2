import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import CustomerModal from "@/components/modals/customer-modal";

export default function Customers() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCustomerModal, setShowCustomerModal] = useState(false);

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

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers", { page, search, type: typeFilter }],
    retry: false,
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      await apiRequest("DELETE", `/api/customers/${customerId}`);
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Cliente eliminato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del cliente",
        variant: "destructive",
      });
    },
  });

  const typeLabels = {
    doctor: "Medico",
    pharmacy: "Farmacia",
    wholesaler: "Grossista",
    private: "Privato",
  };

  const typeColors = {
    doctor: "bg-blue-100 text-blue-800",
    pharmacy: "bg-green-100 text-green-800",
    wholesaler: "bg-purple-100 text-purple-800",
    private: "bg-gray-100 text-gray-800",
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
        <Header title="Clienti" subtitle="Gestione anagrafica clienti" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Anagrafica Clienti</CardTitle>
                <Button 
                  className="bg-primary hover:bg-blue-700"
                  onClick={() => setShowCustomerModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Cliente
                </Button>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Cerca per nome, email o azienda..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Filtra per tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    <SelectItem value="doctor">Medici</SelectItem>
                    <SelectItem value="pharmacy">Farmacie</SelectItem>
                    <SelectItem value="wholesaler">Grossisti</SelectItem>
                    <SelectItem value="private">Privati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {customersLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Caricamento clienti...</p>
                </div>
              ) : !customersData?.customers?.length ? (
                <div className="text-center py-8">
                  <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nessun cliente trovato</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contatti
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punti Fedeltà
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
                      {customersData.customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.companyName || 
                               `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                               "Nome non disponibile"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.city && customer.province ? 
                               `${customer.city}, ${customer.province}` : 
                               customer.city || customer.province || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              className={typeColors[customer.type as keyof typeof typeColors] || typeColors.private}
                            >
                              {typeLabels[customer.type as keyof typeof typeLabels] || customer.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.email}</div>
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.loyaltyPoints || 0} punti
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={customer.isActive ? "default" : "secondary"}>
                              {customer.isActive ? "Attivo" : "Inattivo"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-edit mr-1"></i>
                              Modifica
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteCustomerMutation.mutate(customer.id)}
                              disabled={deleteCustomerMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-trash mr-1"></i>
                              Elimina
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
      
      <CustomerModal 
        open={showCustomerModal}
        onOpenChange={setShowCustomerModal}
      />
    </div>
  );
}
