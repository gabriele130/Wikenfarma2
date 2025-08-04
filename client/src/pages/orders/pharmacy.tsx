import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPharmacy() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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
        <Header title="Ordini Farmacie" subtitle="Gestione ordini farmacie" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Ordini Farmacie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <i className="fas fa-clinic-medical text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Gestione Ordini Farmacie
                </h3>
                <p className="text-gray-500 mb-4">
                  Sezione in fase di sviluppo per la gestione degli ordini delle farmacie
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-blue-900 mb-2">Funzionalità previste:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Integrazione con PharmaEVO</li>
                    <li>• Gestione automatica ordini</li>
                    <li>• Fatturazione e spedizione GLS</li>
                    <li>• Sincronizzazione anagrafiche</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
