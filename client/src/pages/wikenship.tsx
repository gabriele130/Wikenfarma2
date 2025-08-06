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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X, 
  RefreshCw,
  Send,
  Database,
  TrendingUp
} from "lucide-react";

interface WikenshipOrder {
  id: string;
  orderId: string;
  source: "woocommerce" | "ebay" | "direct";
  customerId?: string;
  informatoreId?: string;
  doctorId?: string;
  totalAmount: number;
  netAmount: number;
  vatAmount: number;
  commissionAmount?: number;
  gestlineStatus: "pending" | "sent" | "processed" | "error";
  odooStatus: "pending" | "sent" | "processed" | "error";
  alertGenerated: boolean;
  orderData: any;
  createdAt: string;
  processedAt?: string;
}

export default function Wikenship() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading } = useQuery<WikenshipOrder[]>({
    queryKey: ['/api/wikenship/orders', selectedStatus, selectedSource, searchTerm],
  });

  const processBatchMutation = useMutation({
    mutationFn: async (orderIds: string[]) => {
      return await apiRequest('POST', '/api/wikenship/process-batch', { orderIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wikenship/orders'] });
      toast({
        title: "Successo",
        description: "Ordini processati con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Errore nel processare gli ordini: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const syncOrdersMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/wikenship/sync', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wikenship/orders'] });
      toast({
        title: "Sincronizzazione Completata",
        description: "Ordini sincronizzati da WooCommerce ed eBay.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore Sincronizzazione",
        description: `Errore nella sincronizzazione: ${error.message}`,
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "woocommerce":
        return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      case "ebay":
        return <Package className="w-4 h-4 text-yellow-600" />;
      case "direct":
        return <Database className="w-4 h-4 text-blue-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === "all" || 
      order.gestlineStatus === selectedStatus || 
      order.odooStatus === selectedStatus;
    const matchesSource = selectedSource === "all" || order.source === selectedSource;
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSource && matchesSearch;
  });

  const pendingOrders = orders.filter(order => 
    order.gestlineStatus === "pending" || order.odooStatus === "pending"
  );

  const alertOrders = orders.filter(order => order.alertGenerated);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">Caricamento ordini WIKENSHIP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="WIKENSHIP" subtitle="Integrazione ordini WooCommerce, eBay → GestLine + ODOO" />
        
        <div className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Ordini Totali
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  In Elaborazione
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
                  Alert Generati
                </CardTitle>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">{alertOrders.length}</span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Commissioni Oggi
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    €{orders
                      .filter(o => o.createdAt.startsWith(new Date().toISOString().split('T')[0]))
                      .reduce((sum, o) => sum + (Number(o.commissionAmount) || 0), 0)
                      .toFixed(2)
                    }
                  </span>
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

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le fonti</SelectItem>
                  <SelectItem value="woocommerce">WooCommerce</SelectItem>
                  <SelectItem value="ebay">eBay</SelectItem>
                  <SelectItem value="direct">Diretto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => syncOrdersMutation.mutate()}
                disabled={syncOrdersMutation.isPending}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizza
              </Button>

              <Button
                onClick={() => processBatchMutation.mutate(pendingOrders.map(o => o.id))}
                disabled={processBatchMutation.isPending || pendingOrders.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Processa In Attesa ({pendingOrders.length})
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ordini WIKENSHIP</CardTitle>
              <CardDescription>
                Gestione integrazione ordini privati verso GestLine e ODOO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Ordine</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Importo</TableHead>
                    <TableHead>Commissione</TableHead>
                    <TableHead>GestLine</TableHead>
                    <TableHead>ODOO</TableHead>
                    <TableHead>Alert</TableHead>
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
                          {getSourceIcon(order.source)}
                          <span className="capitalize">{order.source}</span>
                        </div>
                      </TableCell>
                      <TableCell>€{Number(order.totalAmount).toFixed(2)}</TableCell>
                      <TableCell>
                        {order.commissionAmount ? `€${Number(order.commissionAmount).toFixed(2)}` : '-'}
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
                        {order.alertGenerated && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alert
                          </Badge>
                        )}
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
                              onClick={() => processBatchMutation.mutate([order.id])}
                              disabled={processBatchMutation.isPending}
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
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nessun ordine trovato
                  </h3>
                  <p className="text-gray-600">
                    Non ci sono ordini che corrispondono ai filtri selezionati.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}