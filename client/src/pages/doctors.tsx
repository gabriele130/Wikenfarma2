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
import { Badge } from "@/components/ui/badge";
import DoctorModal from "@/components/modals/doctor-modal";

export default function Doctors() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showDoctorModal, setShowDoctorModal] = useState(false);

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

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ["/api/customers", { page, search, type: "doctor" }],
    retry: false,
  });

  const doctors = (doctorsData as any)?.customers || [];

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      await apiRequest("DELETE", `/api/customers/${customerId}`);
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Medico eliminato con successo",
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
        description: "Errore durante l'eliminazione del medico",
        variant: "destructive",
      });
    },
  });

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
        <Header title="Medici" subtitle="Gestione anagrafica medici" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Anagrafica Medici</CardTitle>
                <Button 
                  className="bg-primary hover:bg-blue-700"
                  onClick={() => setShowDoctorModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Nuovo Medico
                </Button>
              </div>
              
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Cerca per nome, cognome o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {doctorsLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Caricamento medici...</p>
                </div>
              ) : !doctors.length ? (
                <div className="text-center py-8">
                  <i className="fas fa-user-md text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nessun medico trovato</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medico
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contatti
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Codice Fiscale
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punti Wikenship
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
                      {doctors.map((doctor: any) => (
                        <tr key={doctor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <i className="fas fa-user-md text-blue-600"></i>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Dr. {`${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() || "Nome non disponibile"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {doctor.city && doctor.province ? 
                                   `${doctor.city}, ${doctor.province}` : 
                                   doctor.city || doctor.province || ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.email}</div>
                            <div className="text-sm text-gray-500">{doctor.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {doctor.fiscalCode || "Non specificato"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900 mr-2">
                                {doctor.loyaltyPoints || 0}
                              </span>
                              <i className="fas fa-star text-warning text-sm"></i>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={doctor.isActive ? "default" : "secondary"}>
                              {doctor.isActive ? "Attivo" : "Inattivo"}
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
                              onClick={() => deleteCustomerMutation.mutate(doctor.id)}
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
      
      <DoctorModal 
        open={showDoctorModal}
        onOpenChange={setShowDoctorModal}
      />
    </div>
  );
}
