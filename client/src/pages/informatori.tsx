import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserCheck, Mail, Phone, MapPin, Share, Eye } from "lucide-react";

const informatoreSchema = z.object({
  firstName: z.string().min(1, "Nome richiesto"),
  lastName: z.string().min(1, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  territory: z.string().optional(),
  isActive: z.boolean().default(true),
});

type InformatoreFormData = z.infer<typeof informatoreSchema>;

interface Informatore {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  territory?: string;
  isActive: boolean;
}

export default function Informatori() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const form = useForm<InformatoreFormData>({
    resolver: zodResolver(informatoreSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      territory: "",
      isActive: true,
    },
  });

  const { data: informatori = [], isLoading } = useQuery<Informatore[]>({
    queryKey: ['/api/informatori'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InformatoreFormData) => {
      return await apiRequest(`/api/informatori`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/informatori'] });
      setShowForm(false);
      form.reset();
      toast({
        title: "Successo",
        description: "Informatore creato con successo.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Informatore creation error:", error);
      toast({
        title: "Errore",
        description: `Errore nella creazione dell'informatore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const copyDashboardLink = (informatoreId: string, informatoreNome: string) => {
    const link = `${window.location.origin}/informatore/${informatoreId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copiato!",
        description: `Link dashboard di ${informatoreNome} copiato negli appunti.`,
      });
    });
  };

  const onSubmit = (data: InformatoreFormData) => {
    createMutation.mutate(data);
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
        <Header title="Informatori" subtitle="Gestione informatori medico-scientifici" />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Informatori Medico-Scientifici</h1>
              <p className="text-gray-600">Gestisci gli informatori e le loro dashboard condivisibili</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Informatore
            </Button>
          </div>

          {showForm && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nuovo Informatore</DialogTitle>
                  <DialogDescription>
                    Aggiungi un nuovo informatore medico-scientifico al sistema.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cognome</FormLabel>
                            <FormControl>
                              <Input placeholder="Cognome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@esempio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono (opzionale)</FormLabel>
                          <FormControl>
                            <Input placeholder="+39 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="territory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Territorio (opzionale)</FormLabel>
                          <FormControl>
                            <Input placeholder="es. Lombardia, Milano e provincia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Attivo</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              L'informatore può accedere alla dashboard
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Annulla
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creazione..." : "Crea Informatore"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {informatori.map((informatore) => (
              <Card key={informatore.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {informatore.firstName} {informatore.lastName}
                    </CardTitle>
                    <Badge variant={informatore.isActive ? "default" : "secondary"}>
                      {informatore.isActive ? "Attivo" : "Inattivo"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    Informatore Medico Scientifico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{informatore.email}</span>
                    </div>
                    {informatore.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{informatore.phone}</span>
                      </div>
                    )}
                    {informatore.territory && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{informatore.territory}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => copyDashboardLink(informatore.id, `${informatore.firstName} ${informatore.lastName}`)}
                    >
                      <Share className="w-4 h-4 mr-1" />
                      Condividi
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/informatore/${informatore.id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {informatori.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun informatore presente
                </h3>
                <p className="text-gray-600 mb-4">
                  Inizia aggiungendo il primo informatore medico scientifico.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Informatore
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}