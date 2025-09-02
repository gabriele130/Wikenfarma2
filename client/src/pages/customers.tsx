import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import CustomerForm from "../components/customers/customer-form";
import { type Customer } from "@shared/schema";
import { 
  Users, 
  Building2, 
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  MoreVertical,
  TrendingUp,
  Euro,
  Calendar,
  Activity,
  Trash2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function CustomersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("privates");

  // Fetch customer statistics
  const { data: customersStats = {
    totalPrivates: 0,
    totalPharmacies: 0,
    newThisMonth: 0,
    activeClients: 0
  } } = useQuery({
    queryKey: ["/api/customers/stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/customers/stats");
      return response.json();
    },
  });

  // Fetch customers based on type and search
  const { data: customersData, isLoading } = useQuery({
    queryKey: ["/api/customers", activeTab, searchQuery],
    queryFn: async () => {
      const type = activeTab === "privates" ? "private" : activeTab === "pharmacies" ? "pharmacy" : "";
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (searchQuery) params.set("search", searchQuery);
      params.set("limit", "50"); // Get more records for better UX
      
      const response = await apiRequest("GET", `/api/customers?${params}`);
      return response.json();
    },
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: async (customerId: string) => {
      await apiRequest("DELETE", `/api/customers/${customerId}`);
    },
    onSuccess: () => {
      toast({
        title: "Cliente eliminato",
        description: "Il cliente è stato eliminato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'eliminazione",
        variant: "destructive",
      });
    },
  });

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete.id);
    }
  };

  const customers = customersData?.customers || [];

  // Filter customers by type
  const privateCustomers = customers.filter(c => c.type === "private");
  const pharmacyCustomers = customers.filter(c => c.type === "pharmacy");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'attivo':
        return 'bg-green-100 text-green-800';
      case 'inattivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestione Clienti</h1>
            <p className="text-blue-100 text-lg">
              Database completo di clienti privati e farmacie
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{customersStats.totalPrivates} clienti privati</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>{customersStats.totalPharmacies} farmacie</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => {
                setSelectedCustomer(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clienti Privati</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customersStats.totalPrivates.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Clienti registrati</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Farmacie</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customersStats.totalPharmacies}</div>
            <p className="text-xs text-slate-500 mt-1">Farmacie partner</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Nuovi Questo Mese</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customersStats.newThisMonth}</div>
            <p className="text-xs text-slate-500 mt-1">Gennaio 2025</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clienti Attivi</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customersStats.activeClients}%</div>
            <p className="text-xs text-slate-500 mt-1">Ultimi 30 giorni</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Tabs */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Users className="h-5 w-5" />
                <span>Database Clienti</span>
              </CardTitle>
              <CardDescription>
                Gestione separata di clienti privati e farmacie
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cerca clienti..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtra
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="privates">
                Clienti Privati ({privateCustomers.length})
              </TabsTrigger>
              <TabsTrigger value="pharmacies">
                Farmacie ({pharmacyCustomers.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="privates" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : privateCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Nessun cliente privato trovato</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Cliente Privato
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Contatti</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600">Ordini</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600">Totale Speso</th>
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {privateCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {((customer.firstName || "") + " " + (customer.lastName || "")).trim().split(' ').map(n => n[0]).join('') || customer.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {customer.firstName && customer.lastName 
                                    ? `${customer.firstName} ${customer.lastName}` 
                                    : customer.name || 'Nome non disponibile'}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Registrato: {formatDate(customer.registrationDate?.toString() || customer.createdAt?.toString() || "")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                  <Mail className="h-3 w-3" />
                                  <span>{customer.email}</span>
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                  <Phone className="h-3 w-3" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                              {customer.address && (
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-xs">{customer.address}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-slate-800">{customer.totalOrders || 0}</div>
                            {customer.lastOrderDate && (
                              <div className="text-xs text-slate-500">
                                Ultimo: {formatDate(customer.lastOrderDate.toString())}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {formatCurrency(Number(customer.totalSpent) || 0)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge className={getStatusColor(customer.status || "active")} variant="secondary">
                              {customer.status === "active" ? "Attivo" : 
                               customer.status === "inactive" ? "Inattivo" : 
                               customer.status === "premium" ? "Premium" : "Attivo"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifica
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizza
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCustomer(customer)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Elimina
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pharmacies" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pharmacyCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Nessuna farmacia trovata</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Farmacia
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Farmacia</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Titolare</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Contatti</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600">Ordini</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600">Fatturato</th>
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-slate-600">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pharmacyCustomers.map((pharmacy) => (
                        <tr key={pharmacy.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{pharmacy.name}</p>
                                {pharmacy.specialization && (
                                  <p className="text-xs text-slate-500">{pharmacy.specialization}</p>
                                )}
                                {pharmacy.partitaIva && (
                                  <p className="text-xs text-slate-500">P.IVA: {pharmacy.partitaIva}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-slate-800">{pharmacy.owner || "Non specificato"}</p>
                            <p className="text-xs text-slate-500">
                              Dal: {formatDate(pharmacy.registrationDate?.toString() || pharmacy.createdAt?.toString() || "")}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {pharmacy.email && (
                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                  <Mail className="h-3 w-3" />
                                  <span>{pharmacy.email}</span>
                                </div>
                              )}
                              {pharmacy.phone && (
                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                  <Phone className="h-3 w-3" />
                                  <span>{pharmacy.phone}</span>
                                </div>
                              )}
                              {pharmacy.address && (
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-xs">{pharmacy.address}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-slate-800">{pharmacy.totalOrders || 0}</div>
                            {pharmacy.lastOrderDate && (
                              <div className="text-xs text-slate-500">
                                Ultimo: {formatDate(pharmacy.lastOrderDate.toString())}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {formatCurrency(Number(pharmacy.totalSpent) || 0)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge className={getStatusColor(pharmacy.status || "active")} variant="secondary">
                              {pharmacy.status === "active" ? "Attivo" : 
                               pharmacy.status === "inactive" ? "Inattivo" : 
                               pharmacy.status === "premium" ? "Premium" : "Attivo"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCustomer(pharmacy)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifica
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizza
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCustomer(pharmacy)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Elimina
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Users className="h-5 w-5" />
              <span>Azioni Rapide - Privati</span>
            </CardTitle>
            <CardDescription>Gestione clienti privati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Cliente Privato
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Cerca Cliente
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Euro className="h-4 w-4 mr-2" />
              Report Acquisti
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Building2 className="h-5 w-5" />
              <span>Azioni Rapide - Farmacie</span>
            </CardTitle>
            <CardDescription>Gestione farmacie partner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Nuova Farmacia
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="h-4 w-4 mr-2" />
              Gestisci Partnership
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Euro className="h-4 w-4 mr-2" />
              Fatturato Farmacie
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Activity className="h-5 w-5" />
              <span>Statistiche Veloci</span>
            </CardTitle>
            <CardDescription>Metriche principali</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Ordini mese</span>
                <span className="text-lg font-bold text-blue-600">234</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Fatturato mese</span>
                <span className="text-lg font-bold text-green-600">€28.5k</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800">Clienti attivi</span>
                <span className="text-lg font-bold text-purple-600">89.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Form Dialog */}
      <CustomerForm
        open={showForm}
        onOpenChange={setShowForm}
        customer={selectedCustomer}
        onSuccess={() => {
          setSelectedCustomer(null);
          // Refresh data is handled by the form component
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare {customerToDelete?.type === "private" 
                ? `il cliente ${customerToDelete?.firstName} ${customerToDelete?.lastName}` 
                : `la farmacia ${customerToDelete?.name}`}?
              <br />
              <span className="text-red-600 font-medium">
                Questa azione non può essere annullata.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}