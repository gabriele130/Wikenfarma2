import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  Euro,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck
} from "lucide-react";

// Form schemas
const orderItemSchema = z.object({
  productId: z.string().min(1, "Seleziona un prodotto"),
  quantity: z.number().min(1, "Quantità deve essere almeno 1"),
  unitPrice: z.number().min(0.01, "Prezzo deve essere maggiore di 0"),
  total: z.number().min(0.01, "Totale deve essere maggiore di 0")
});

const orderFormSchema = z.object({
  customerId: z.string().min(1, "Seleziona un cliente"),
  customerType: z.enum(["private", "pharmacy"]),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  subtotal: z.number().min(0.01, "Subtotale deve essere maggiore di 0"),
  tax: z.number().min(0, "Tassa non può essere negativa").default(0),
  total: z.number().min(0.01, "Totale deve essere maggiore di 0"),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Aggiungi almeno un prodotto")
});

type OrderFormData = z.infer<typeof orderFormSchema>;

// Status configurations
const statusConfig = {
  pending: { label: "In Attesa", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confermato", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "In Lavorazione", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Spedito", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Consegnato", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Annullato", color: "bg-red-100 text-red-800", icon: AlertTriangle }
};

const customerTypeConfig = {
  private: { label: "Privato", color: "bg-gray-100 text-gray-800" },
  pharmacy: { label: "Farmacia", color: "bg-blue-100 text-blue-800" }
};

export default function OrdersManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const { toast } = useToast();

  // Fetch orders with filters
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["/api/orders", page, selectedStatus, selectedCustomerType, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedCustomerType !== "all") params.set("customerType", selectedCustomerType);
      if (searchQuery) params.set("search", searchQuery);

      const response = await apiRequest("GET", `/api/orders?${params}`);
      return response.json();
    },
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/customers");
      return response.json();
    },
  });

  // Fetch products for dropdown
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/products");
      return response.json();
    },
  });

  // Fetch order statistics
  const { data: statistics } = useQuery({
    queryKey: ["/api/orders/statistics"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/orders/statistics");
      return response.json();
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/statistics"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Ordine creato",
        description: "L'ordine è stato creato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione dell'ordine.",
        variant: "destructive",
      });
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OrderFormData> }) => {
      const response = await apiRequest("PUT", `/api/orders/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/statistics"] });
      setIsEditDialogOpen(false);
      setEditingOrder(null);
      toast({
        title: "Ordine aggiornato",
        description: "L'ordine è stato aggiornato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento dell'ordine.",
        variant: "destructive",
      });
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/statistics"] });
      toast({
        title: "Ordine eliminato",
        description: "L'ordine è stato eliminato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'eliminazione dell'ordine.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteOrder = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo ordine?")) {
      deleteOrderMutation.mutate(id);
    }
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;
  const totalPages = Math.ceil(totalOrders / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8" />
                Gestione Ordini
              </h1>
              <p className="text-blue-100 text-lg">
                Sistema completo per la gestione degli ordini
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuovo Ordine
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Crea Nuovo Ordine</DialogTitle>
                </DialogHeader>
                <OrderForm
                  customers={customers}
                  products={products}
                  onSubmit={(data) => createOrderMutation.mutate(data)}
                  isLoading={createOrderMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Ordini Totali</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {Number(statistics.totalOrders) || 0}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Fatturato Totale</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatCurrency(Number(statistics.totalRevenue) || 0)}
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Attesa</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {Number(statistics.pendingOrders) || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completati</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {Number(statistics.completedOrders) || 0}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cerca ordini..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli Stati</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCustomerType} onValueChange={setSelectedCustomerType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i Tipi</SelectItem>
                  <SelectItem value="private">Privati</SelectItem>
                  <SelectItem value="pharmacy">Farmacie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle>Lista Ordini</CardTitle>
            <CardDescription>
              Gestisci tutti gli ordini del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero Ordine</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Totale</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          {order.customer ? 
                            (order.customer.name || `${order.customer.firstName} ${order.customer.lastName}`) : 
                            'Cliente non trovato'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={customerTypeConfig[order.customerType as keyof typeof customerTypeConfig]?.color}>
                            {customerTypeConfig[order.customerType as keyof typeof customerTypeConfig]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color}>
                            {statusConfig[order.status as keyof typeof statusConfig]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(Number(order.total))}
                        </TableCell>
                        <TableCell>
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Precedente
                    </Button>
                    <span className="flex items-center px-4">
                      Pagina {page} di {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Successiva
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Modifica Ordine</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <OrderForm
              customers={customers}
              products={products}
              defaultValues={editingOrder}
              onSubmit={(data) => updateOrderMutation.mutate({ 
                id: editingOrder.id, 
                data 
              })}
              isLoading={updateOrderMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Order Form Component
function OrderForm({ 
  customers, 
  products, 
  defaultValues, 
  onSubmit, 
  isLoading 
}: {
  customers: any[];
  products: any[];
  defaultValues?: any;
  onSubmit: (data: OrderFormData) => void;
  isLoading: boolean;
}) {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: defaultValues || {
      customerType: "private",
      status: "pending",
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: "",
      items: []
    }
  });

  const [orderItems, setOrderItems] = useState<any[]>(defaultValues?.items || []);

  const addOrderItem = () => {
    setOrderItems([...orderItems, { 
      productId: "", 
      quantity: 1, 
      unitPrice: 0, 
      total: 0 
    }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
    calculateTotals(newItems);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate total for item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setOrderItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subtotal * 0.22; // 22% IVA
    const total = subtotal + tax;
    
    form.setValue('subtotal', subtotal);
    form.setValue('tax', tax);
    form.setValue('total', total);
  };

  const handleSubmit = (data: OrderFormData) => {
    const finalData = {
      ...data,
      items: orderItems
    };
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name || `${customer.firstName} ${customer.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="private">Privato</SelectItem>
                    <SelectItem value="pharmacy">Farmacia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Note aggiuntive..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Prodotti</h3>
            <Button type="button" onClick={addOrderItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Prodotto
            </Button>
          </div>

          {orderItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Prodotto</Label>
                  <Select 
                    onValueChange={(value) => {
                      const product = products.find(p => p.id === value);
                      updateOrderItem(index, 'productId', value);
                      if (product) {
                        updateOrderItem(index, 'unitPrice', Number(product.price));
                      }
                    }}
                    defaultValue={item.productId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona prodotto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - €{product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantità</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Prezzo Unitario</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateOrderItem(index, 'unitPrice', Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Totale</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.total}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOrderItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Totals */}
        <Card className="p-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotale:</span>
              <span>€{form.watch('subtotal')?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (22%):</span>
              <span>€{form.watch('tax')?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Totale:</span>
              <span>€{form.watch('total')?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => {}}>
            Annulla
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salva Ordine"}
          </Button>
        </div>
      </form>
    </Form>
  );
}