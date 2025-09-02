import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Pill, 
  Database, 
  CheckCircle, 
  Clock, 
  X, 
  RefreshCw,
  Send,
  BarChart3,
  Tag
} from "lucide-react";

interface PharmaevoOrder {
  id: string;
  orderId: string;
  pharmacyId?: string;
  totalAmount: number;
  iqviaData: any;
  gestlineStatus: "pending" | "sent" | "processed" | "error";
  odooStatus: "pending" | "sent" | "processed" | "error";
  odooTags: string[];
  createdAt: string;
  processedAt?: string;
}

export default function PharmaEVO() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading } = useQuery<PharmaevoOrder[]>({
    queryKey: ['/api/pharmaevo/orders', selectedStatus, searchTerm],
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/pharmaevo/sync', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pharmaevo/orders'] });
      toast({
        title: "Sincronizzazione Completata",
        description: "Ordini farmacie sincronizzati da PharmaEVO.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore Sincronizzazione",
        description: `Errore nella sincronizzazione PharmaEVO: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "sent":
        return <Send className="w-4 h-4 text-blue-500" />;
      case "processed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === "all" || 
      order.gestlineStatus === selectedStatus || 
      order.odooStatus === selectedStatus;
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const pendingOrders = orders.filter(order => 
    order.gestlineStatus === "pending" || order.odooStatus === "pending"
  );

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">Caricamento ordini PharmaEVO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="PharmaEVO" subtitle="Integrazione ordini farmacie → GestLine + ODOO (Tag Farm)" />
        
        <div className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Ordini Farmacie
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Da Processare
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Fatturato Totale
                </CardTitle>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    €{totalRevenue.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tag ODOO
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" />
                  <Badge variant="outline" className="text-sm font-bold">
                    Farm
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <Input
                placeholder="Cerca per ID ordine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="pending">In attesa</SelectItem>
                  <SelectItem value="sent">Inviati</SelectItem>
                  <SelectItem value="processed">Processati</SelectItem>
                  <SelectItem value="error">Errore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizza PharmaEVO
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ordini Farmacie PharmaEVO</CardTitle>
              <CardDescription>
                Gestione integrazione ordini farmacie verso GestLine e ODOO con tagging automatico "Farm"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Ordine</TableHead>
                    <TableHead>Farmacia</TableHead>
                    <TableHead>Importo</TableHead>
                    <TableHead>Dati IQVIA</TableHead>
                    <TableHead>GestLine</TableHead>
                    <TableHead>ODOO</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-green-500" />
                          <span>{order.pharmacyId || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>€{Number(order.totalAmount).toFixed(2)}</TableCell>
                      <TableCell>
                        {order.iqviaData ? (
                          <Badge variant="default">
                            <Database className="w-3 h-3 mr-1" />
                            Disponibili
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            N/A
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.gestlineStatus)}
                          <Badge variant={
                            order.gestlineStatus === "processed" ? "default" :
                            order.gestlineStatus === "error" ? "destructive" :
                            "secondary"
                          }>
                            {order.gestlineStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.odooStatus)}
                          <Badge variant={
                            order.odooStatus === "processed" ? "default" :
                            order.odooStatus === "error" ? "destructive" :
                            "secondary"
                          }>
                            {order.odooStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.odooTags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('it-IT')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            Dettagli
                          </Button>
                          {(order.gestlineStatus === "pending" || order.odooStatus === "pending") && (
                            <Button 
                              size="sm" 
                              disabled={syncMutation.isPending}
                            >
                              Processa
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nessun ordine trovato
                  </h3>
                  <p className="text-gray-600">
                    Non ci sono ordini farmacie che corrispondono ai filtri selezionati.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IQVIA Data Integration Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Integrazione Dati IQVIA
              </CardTitle>
              <CardDescription>
                Arricchimento automatico ordini con dati di mercato IQVIA per analytics avanzate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Pill className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Dati Prodotto</h3>
                  <p className="text-sm text-gray-600">
                    Informazioni mercato e pricing
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-gray-600">
                    Trend vendite e performance
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Tag className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Tagging ODOO</h3>
                  <p className="text-sm text-gray-600">
                    Classificazione automatica "Farm"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}