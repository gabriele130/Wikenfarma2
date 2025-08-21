import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
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
  Activity
} from "lucide-react";

export default function CustomersPage() {
  // Demo customers data
  const customersStats = {
    totalPrivates: 1247,
    totalPharmacies: 156,
    newThisMonth: 34,
    activeClients: 89.5
  };

  const privateClients = [
    {
      id: "1",
      name: "Mario Rossi",
      email: "mario.rossi@email.com",
      phone: "+39 348 123 4567",
      address: "Via Roma 123, Milano",
      registrationDate: "2024-03-15",
      totalOrders: 12,
      totalSpent: 1250.75,
      lastOrder: "2025-01-15",
      status: "Attivo"
    },
    {
      id: "2", 
      name: "Giulia Verdi",
      email: "giulia.verdi@gmail.com",
      phone: "+39 335 987 6543",
      address: "Corso Italia 45, Roma",
      registrationDate: "2024-01-10",
      totalOrders: 28,
      totalSpent: 2890.50,
      lastOrder: "2025-01-18",
      status: "Attivo"
    },
    {
      id: "3",
      name: "Antonio Bianchi", 
      email: "a.bianchi@libero.it",
      phone: "+39 329 456 7890",
      address: "Piazza Garibaldi 12, Napoli",
      registrationDate: "2023-11-20",
      totalOrders: 45,
      totalSpent: 4120.25,
      lastOrder: "2025-01-10",
      status: "Premium"
    },
    {
      id: "4",
      name: "Sara Neri",
      email: "sara.neri@yahoo.it", 
      phone: "+39 342 111 2222",
      address: "Via Dante 78, Firenze",
      registrationDate: "2024-06-08",
      totalOrders: 6,
      totalSpent: 580.00,
      lastOrder: "2024-12-20",
      status: "Inattivo"
    }
  ];

  const pharmacies = [
    {
      id: "1",
      name: "Farmacia Centrale",
      owner: "Dott. Francesco Lombardi",
      email: "info@farmaciacentrale.it",
      phone: "+39 02 123 4567",
      address: "Via Venezia 45, Milano",
      partitaIva: "12345678901",
      registrationDate: "2023-08-12",
      totalOrders: 156,
      totalSpent: 45750.25,
      lastOrder: "2025-01-19",
      status: "Premium",
      specialization: "Farmacia Generale"
    },
    {
      id: "2",
      name: "Farmacia San Marco",
      owner: "Dott.ssa Elena Ricci", 
      email: "farmacia.sanmarco@email.com",
      phone: "+39 06 987 6543",
      address: "Piazza San Marco 12, Roma",
      partitaIva: "98765432109",
      registrationDate: "2024-02-05",
      totalOrders: 89,
      totalSpent: 28940.75,
      lastOrder: "2025-01-17",
      status: "Attivo",
      specialization: "Dermatologia"
    },
    {
      id: "3",
      name: "Farmacia Moderna",
      owner: "Dott. Giuseppe Marino",
      email: "moderna@farmacie.com",
      phone: "+39 081 345 6789",
      address: "Corso Umberto 89, Napoli", 
      partitaIva: "45678912345",
      registrationDate: "2023-05-20",
      totalOrders: 203,
      totalSpent: 67820.50,
      lastOrder: "2025-01-18",
      status: "Premium",
      specialization: "Pediatrica"
    },
    {
      id: "4",
      name: "Farmacia del Borgo",
      owner: "Dott.ssa Anna Ferri",
      email: "borgo@farmacia.net",
      phone: "+39 055 222 3333",
      address: "Via del Borgo 23, Firenze",
      partitaIva: "67891234567",
      registrationDate: "2024-09-10",
      totalOrders: 34,
      totalSpent: 12650.00,
      lastOrder: "2025-01-12",
      status: "Attivo",
      specialization: "Omeopatica"
    }
  ];

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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtra
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Cerca
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="privates" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="privates">Clienti Privati</TabsTrigger>
              <TabsTrigger value="pharmacies">Farmacie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="privates" className="space-y-4">
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
                    {privateClients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{client.name}</p>
                              <p className="text-xs text-slate-500">
                                Registrato: {formatDate(client.registrationDate)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-slate-600">
                              <Mail className="h-3 w-3" />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-600">
                              <Phone className="h-3 w-3" />
                              <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-xs">{client.address}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-slate-800">{client.totalOrders}</div>
                          <div className="text-xs text-slate-500">Ultimo: {formatDate(client.lastOrder)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-slate-800">
                          {formatCurrency(client.totalSpent)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={getStatusColor(client.status)} variant="secondary">
                            {client.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="pharmacies" className="space-y-4">
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
                    {pharmacies.map((pharmacy) => (
                      <tr key={pharmacy.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{pharmacy.name}</p>
                              <p className="text-xs text-slate-500">{pharmacy.specialization}</p>
                              <p className="text-xs text-slate-500">P.IVA: {pharmacy.partitaIva}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-800">{pharmacy.owner}</p>
                          <p className="text-xs text-slate-500">
                            Dal: {formatDate(pharmacy.registrationDate)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-slate-600">
                              <Mail className="h-3 w-3" />
                              <span>{pharmacy.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-600">
                              <Phone className="h-3 w-3" />
                              <span>{pharmacy.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-xs">{pharmacy.address}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-slate-800">{pharmacy.totalOrders}</div>
                          <div className="text-xs text-slate-500">Ultimo: {formatDate(pharmacy.lastOrder)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-slate-800">
                          {formatCurrency(pharmacy.totalSpent)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={getStatusColor(pharmacy.status)} variant="secondary">
                            {pharmacy.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
}