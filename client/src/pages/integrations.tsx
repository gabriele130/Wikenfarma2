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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Integrations() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: ["/api/integrations"],
    retry: false,
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ name, isActive }: { name: string; isActive: boolean }) => {
      await apiRequest("PUT", `/api/integrations/${name}`, {
        isActive,
        lastSync: isActive ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Integrazione aggiornata con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
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
        description: "Errore durante l'aggiornamento dell'integrazione",
        variant: "destructive",
      });
    },
  });

  const integrationDetails = {
    gestline: {
      name: "Gestline",
      description: "Sistema gestionale principale per ordini e fatturazione",
      icon: "fas fa-cogs",
      color: "primary",
      features: ["Importazione ordini", "Gestione documenti", "Allineamento anagrafiche"]
    },
    odoo: {
      name: "Odoo",
      description: "CRM e marketing automation per gestione clienti",
      icon: "fas fa-users-cog",
      color: "secondary",
      features: ["Sincronizzazione anagrafiche", "Tag marketing", "Newsletter", "Automazioni"]
    },
    gls: {
      name: "GLS",
      description: "Corriere per spedizioni e tracking automatico",
      icon: "fas fa-truck",
      color: "info",
      features: ["Creazione etichette", "Tracking spedizioni", "Gestione consegne"]
    },
    pharmaevo: {
      name: "PharmaEVO",
      description: "Gestionale ISF per calcolo compensi e bonus",
      icon: "fas fa-pills",
      color: "accent",
      features: ["Import dati IQVIA", "Calcolo compensi", "Gestione bonus"]
    },
    ebay: {
      name: "eBay",
      description: "Marketplace per vendite online",
      icon: "fab fa-ebay",
      color: "warning",
      features: ["Download ordini", "Gestione listing", "Feedback automatico"]
    },
    ecommerce: {
      name: "eCommerce",
      description: "Sito web wikenfarma.com per vendite dirette",
      icon: "fas fa-shopping-cart",
      color: "success",
      features: ["Ordini automatici", "Catalogo prodotti", "Pagamenti online"]
    }
  };

  const statusColors = {
    online: "bg-success text-white",
    offline: "bg-error text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    warning: "Avviso",
    error: "Errore",
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
        <Header title="Integrazioni" subtitle="Gestione integrazioni sistemi esterni" />
        
        <div className="p-6 space-y-6">
          {/* Integration Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Integrazioni Attive</p>
                  <p className="text-3xl font-bold text-success">
                    {integrations?.filter(i => i.isActive).length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-plug text-success text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Integrazioni Totali</p>
                  <p className="text-3xl font-bold text-info">
                    {integrations?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-network-wired text-info text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ultima Sync</p>
                  <p className="text-3xl font-bold text-primary">2m</p>
                  <p className="text-sm text-gray-500">fa</p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sync-alt text-primary text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problemi</p>
                  <p className="text-3xl font-bold text-warning">1</p>
                  <p className="text-sm text-warning">Richiede attenzione</p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-warning text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(integrationDetails).map(([key, details]) => {
              const integration = integrations?.find(i => i.name === key);
              const isActive = integration?.isActive || false;
              const status = integration?.status || "offline";
              
              return (
                <Card key={key} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 bg-${details.color} bg-opacity-10 rounded-lg flex items-center justify-center mr-3`}>
                          <i className={`${details.icon} text-${details.color} text-xl`}></i>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{details.name}</CardTitle>
                          <Badge className={statusColors[status as keyof typeof statusColors]}>
                            {statusLabels[status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => 
                          updateIntegrationMutation.mutate({ name: key, isActive: checked })
                        }
                        disabled={updateIntegrationMutation.isPending}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{details.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Funzionalità:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {details.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <i className="fas fa-check text-success text-xs mr-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {integration?.lastSync && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Ultima sincronizzazione: {new Date(integration.lastSync).toLocaleString("it-IT")}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <i className="fas fa-cog mr-1"></i>
                        Configura
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        disabled={!isActive}
                        variant={isActive ? "default" : "outline"}
                      >
                        <i className="fas fa-sync-alt mr-1"></i>
                        Sincronizza
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Integration Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Log Integrazioni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-4">Log delle integrazioni non ancora implementati</p>
                <p className="text-sm text-gray-400">
                  Qui verranno mostrati i log dettagliati di tutte le attività di sincronizzazione
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
