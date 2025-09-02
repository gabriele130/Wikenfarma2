import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useCompensations, useCompensationStats } from "../hooks/use-compensations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  Plus,
  Euro,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Edit,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Building2,
  Target,
  Award,
  Briefcase
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function InformatoriPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInformatore, setEditingInformatore] = useState<any>(null);

  // Form state for creating/editing informatori
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "freelancer" as "employee" | "freelancer",
    area: "",
    fixedSalary: "",
    cutOffAmount: "",
    commissionPercentage: "",
    notes: ""
  });

  // Fetch informatori data
  const { data: informatori = [], isLoading: informatoriLoading } = useQuery({
    queryKey: ["/api/informatori", searchQuery, selectedArea, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedArea !== "all") params.set("area", selectedArea);
      if (selectedType !== "all") params.set("type", selectedType);
      
      const response = await apiRequest("GET", `/api/informatori?${params}`);
      return response.json();
    },
  });

  // Use compensation stats hook
  const { data: compensationStats = {
    totalCompensations: 0,
    totalDipendenti: 0,
    totalLiberiProfessionisti: 0,
    avgCompensation: 0,
    activeInformatori: 0,
    topPerformer: null
  } } = useCompensationStats(selectedMonth, selectedYear);

  // Create informatore mutation
  const createInformatoreMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/informatori", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Informatore Creato",
        description: "L'informatore è stato aggiunto con successo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/informatori"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante la creazione.",
        variant: "destructive",
      });
    },
  });

  // Update informatore mutation
  const updateInformatoreMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await apiRequest("PUT", `/api/informatori/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Informatore Aggiornato",
        description: "Le modifiche sono state salvate con successo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/informatori"] });
      setEditingInformatore(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      userType: "freelancer",
      area: "",
      fixedSalary: "",
      cutOffAmount: "",
      commissionPercentage: "",
      notes: ""
    });
  };

  const handleCreateSubmit = () => {
    createInformatoreMutation.mutate({
      ...formData,
      fixedSalary: parseFloat(formData.fixedSalary) || 0,
      cutOffAmount: formData.userType === "freelancer" ? parseFloat(formData.cutOffAmount) || 0 : 0,
      commissionPercentage: formData.userType === "freelancer" ? parseFloat(formData.commissionPercentage) || 0 : 0,
    });
  };

  const handleUpdateSubmit = () => {
    updateInformatoreMutation.mutate({
      id: editingInformatore.id,
      ...formData,
      fixedSalary: parseFloat(formData.fixedSalary) || 0,
      cutOffAmount: formData.userType === "freelancer" ? parseFloat(formData.cutOffAmount) || 0 : 0,
      commissionPercentage: formData.userType === "freelancer" ? parseFloat(formData.commissionPercentage) || 0 : 0,
    });
  };

  const openEditDialog = (informatore: any) => {
    setEditingInformatore(informatore);
    setFormData({
      firstName: informatore.firstName || "",
      lastName: informatore.lastName || "",
      email: informatore.email || "",
      phone: informatore.phone || "",
      userType: informatore.userType || "freelancer",
      area: informatore.area || "",
      fixedSalary: informatore.fixedSalary?.toString() || "",
      cutOffAmount: informatore.cutOffAmount?.toString() || "",
      commissionPercentage: informatore.commissionPercentage?.toString() || "",
      notes: informatore.notes || ""
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    return type === 'employee' 
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const getTypeLabel = (type: string) => {
    return type === 'employee' ? 'Dipendente' : 'Libero Prof.';
  };

  // Get unique areas for filter
  const uniqueAreas = Array.from(new Set(informatori.map((inf: any) => inf.area).filter(Boolean)));

  const months = [
    { value: 1, label: "Gennaio" },
    { value: 2, label: "Febbraio" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Aprile" },
    { value: 5, label: "Maggio" },
    { value: 6, label: "Giugno" },
    { value: 7, label: "Luglio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Settembre" },
    { value: 10, label: "Ottobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Dicembre" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestione Informatori ISF</h1>
              <p className="text-indigo-100 text-lg">
                Sistema completo per la gestione degli Informatori Scientifici del Farmaco
              </p>
            </div>
            <div className="text-right space-x-3">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nuovo Informatore
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingInformatore ? "Modifica Informatore" : "Nuovo Informatore"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingInformatore 
                        ? "Modifica i dati dell'informatore selezionato."
                        : "Aggiungi un nuovo Informatore Scientifico del Farmaco al sistema."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Nome dell'informatore"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Cognome</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Cognome dell'informatore"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@esempio.it"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+39 123 456 7890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userType">Tipo Contratto</Label>
                      <Select value={formData.userType} onValueChange={(value: "employee" | "freelancer") => setFormData({ ...formData, userType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Dipendente</SelectItem>
                          <SelectItem value="freelancer">Libero Professionista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="area">Area di Competenza</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="es. Nord Italia, Lombardia, Milano"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fixedSalary">Stipendio Fisso (€)</Label>
                      <Input
                        id="fixedSalary"
                        type="number"
                        step="0.01"
                        value={formData.fixedSalary}
                        onChange={(e) => setFormData({ ...formData, fixedSalary: e.target.value })}
                        placeholder="2500.00"
                      />
                    </div>
                    {formData.userType === "freelancer" && (
                      <>
                        <div>
                          <Label htmlFor="cutOffAmount">Cut-off (€)</Label>
                          <Input
                            id="cutOffAmount"
                            type="number"
                            step="0.01"
                            value={formData.cutOffAmount}
                            onChange={(e) => setFormData({ ...formData, cutOffAmount: e.target.value })}
                            placeholder="10000.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="commissionPercentage">Percentuale Commissione (%)</Label>
                          <Input
                            id="commissionPercentage"
                            type="number"
                            step="0.01"
                            value={formData.commissionPercentage}
                            onChange={(e) => setFormData({ ...formData, commissionPercentage: e.target.value })}
                            placeholder="15.00"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="notes">Note</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Note aggiuntive sull'informatore..."
                      rows={3}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingInformatore(null);
                        resetForm();
                      }}
                    >
                      Annulla
                    </Button>
                    <Button 
                      onClick={editingInformatore ? handleUpdateSubmit : handleCreateSubmit}
                      disabled={createInformatoreMutation.isPending || updateInformatoreMutation.isPending}
                    >
                      {(createInformatoreMutation.isPending || updateInformatoreMutation.isPending) 
                        ? "Salvando..." 
                        : (editingInformatore ? "Aggiorna" : "Crea Informatore")
                      }
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">ISF Attivi</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.activeInformatori || informatori.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dipendenti</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.totalDipendenti}</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Liberi Prof.</p>
                  <p className="text-2xl font-bold text-slate-800">{compensationStats.totalLiberiProfessionisti}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Compenso Medio</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(compensationStats.avgCompensation || 0)}
                  </p>
                </div>
                <Euro className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Top Performer</p>
                  <p className="text-lg font-bold text-slate-800">
                    {compensationStats.topPerformer || "N/A"}
                  </p>
                </div>
                <Award className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="list">Lista Informatori</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-3">
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cerca informatori..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtra per area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le aree</SelectItem>
                      {uniqueAreas.map((area, index) => (
                        <SelectItem key={`${area}-${index}`} value={area as string}>
                          {area as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtra per tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i tipi</SelectItem>
                      <SelectItem value="employee">Dipendenti</SelectItem>
                      <SelectItem value="freelancer">Liberi Prof.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Informatori Table */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Informatori Scientifici del Farmaco</span>
                </CardTitle>
                <CardDescription>
                  Gestione completa del team ISF con compensi e performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {informatoriLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Informatore</TableHead>
                        <TableHead>Contatti</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Stipendio Fisso</TableHead>
                        <TableHead>Cut-off</TableHead>
                        <TableHead>Commissione</TableHead>
                        <TableHead className="text-right">Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {informatori.map((informatore: any) => (
                        <TableRow key={informatore.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {informatore.firstName} {informatore.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {informatore.id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {informatore.email && (
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {informatore.email}
                                </div>
                              )}
                              {informatore.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {informatore.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTypeColor(informatore.userType)}>
                              {getTypeLabel(informatore.userType)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {informatore.area || "Non specificata"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(informatore.fixedSalary || 0)}
                          </TableCell>
                          <TableCell>
                            {informatore.userType === "freelancer" 
                              ? formatCurrency(informatore.cutOffAmount || 0)
                              : "N/A"
                            }
                          </TableCell>
                          <TableCell>
                            {informatore.userType === "freelancer" 
                              ? `${informatore.commissionPercentage || 0}%`
                              : "N/A"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  openEditDialog(informatore);
                                  setIsCreateDialogOpen(true);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifica
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Dettagli
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Report Compensi
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60">
              <CardHeader>
                <CardTitle>Analytics Performance ISF</CardTitle>
                <CardDescription>
                  Analisi delle performance degli Informatori Scientifici del Farmaco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics avanzate in sviluppo</p>
                  <p className="text-sm">Grafici di performance, trend compensi e KPI verranno implementati qui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}