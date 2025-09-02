import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Link } from "wouter"
import { useAuth } from "../hooks/use-auth"
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  Users, 
  BarChart3, 
  ShoppingCart,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Pill,
  Building2,
  UserCheck,
  ArrowRight,
  Calendar,
  Target,
  Award,
  Zap
} from "lucide-react"

// Mock data per dashboard
const mockStats = {
  totalRevenue: 125420.50,
  totalOrders: 847,
  totalCustomers: 234,
  activeProducts: 1205
}

const mockOrders = [
  { id: "1", customer: "Farmacia Centrale", amount: 245.50, status: "completed" },
  { id: "2", customer: "Dr. Mario Rossi", amount: 89.90, status: "pending" },
  { id: "3", customer: "Farmacia San Giuseppe", amount: 345.20, status: "shipped" },
]

export default function Dashboard() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      {/* Welcome Section - Personalizzata per tipo utente */}
      {user?.userType === "informatore" ? (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-800">Area Informatore Medico</CardTitle>
                <CardDescription className="text-green-600">
                  Gestisci i tuoi clienti e le commissioni
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Pill className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-blue-800">Dashboard WikenFarma</CardTitle>
                <CardDescription className="text-blue-600">
                  Centro di controllo sistema gestionale
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% dal mese scorso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% dal mese scorso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% dal mese scorso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prodotti</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="inline h-3 w-3 mr-1" />
              98% disponibili
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="orders">Ordini Recenti</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle>Integrazioni Sistema</CardTitle>
                <CardDescription>
                  Stato delle integrazioni esterne
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>GestLine</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>ODOO</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>PharmaEVO</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Sync
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle>Attività Recenti</CardTitle>
                <CardDescription>
                  Ultime operazioni nel sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Ordine #1247 completato</span>
                    <span className="text-muted-foreground ml-auto">2 min fa</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>Nuovo ordine da Farmacia Centrale</span>
                    <span className="text-muted-foreground ml-auto">15 min fa</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span>Stock basso: Aspirina 500mg</span>
                    <span className="text-muted-foreground ml-auto">1 ora fa</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle>Ordini Recenti</CardTitle>
              <CardDescription>
                Gli ultimi ordini ricevuti nel sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">Ordine #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{order.amount}</p>
                      <Badge 
                        variant={order.status === "completed" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {order.status === "completed" ? "Completato" : 
                         order.status === "pending" ? "In attesa" : "Spedito"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/orders">
                  <Button variant="outline" className="bg-white/50 hover:bg-white/70">
                    Visualizza tutti gli ordini
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle>Performance Mensile</CardTitle>
                <CardDescription>
                  Andamento fatturato ultimi 6 mesi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  <span>Grafico Analytics - Da implementare</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle>Prodotti Più Venduti</CardTitle>
                <CardDescription>
                  Top 5 prodotti per volume di vendita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Aspirina 500mg", sales: 245 },
                    { name: "Paracetamolo 1000mg", sales: 198 },
                    { name: "Ibuprofene 600mg", sales: 156 },
                    { name: "Omeprazolo 20mg", sales: 134 },
                    { name: "Amoxicillina 875mg", sales: 112 },
                  ].map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                      <Badge variant="secondary">{product.sales}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">98.7%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
                <div className="h-6 w-px bg-slate-300"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-slate-600">Monitoraggio</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18.7%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">€458,920</h3>
                <p className="text-slate-600 text-sm">Fatturato Mensile</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12.3%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">1,847</h3>
                <p className="text-slate-600 text-sm">Ordini Attivi</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-purple-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8.9%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">12,456</h3>
                <p className="text-slate-600 text-sm">Clienti Attivi</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+24.1%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">89.4%</h3>
                <p className="text-slate-600 text-sm">Performance ISF</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Main Modules Grid */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Moduli Sistema</h2>
              <p className="text-slate-600">Accesso rapido alle funzionalità principali</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* WIKENSHIP Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">WIKENSHIP</CardTitle>
                  <CardDescription className="text-slate-600">Integrazione E-commerce</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Gestione centralizzata ordini WooCommerce, eBay e marketplace. 
                  Sincronizzazione automatica con GestLine e analytics ODOO.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status:</span>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Attivo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Ordini oggi:</span>
                  <span className="font-medium text-slate-900">127</span>
                </div>
                <Link href="/wikenship">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                    Accedi al Modulo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PharmaEVO Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">PharmaEVO</CardTitle>
                  <CardDescription className="text-slate-600">Gestione Farmacie</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Sistema dedicato alla gestione ordini farmacie. Bridge diretto 
                  con GestLine ERP e tagging automatico ODOO.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status:</span>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Operativo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Farmacie collegate:</span>
                  <span className="font-medium text-slate-900">89</span>
                </div>
                <Link href="/pharmaevo">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                    Accedi al Modulo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Analytics</CardTitle>
                  <CardDescription className="text-slate-600">Business Intelligence</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Dashboard avanzate con analisi multi-dimensionale, confronti 
                  temporali e KPI performance ISF in tempo reale.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status:</span>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Zap className="h-4 w-4" />
                    <span>Real-time</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Report generati:</span>
                  <span className="font-medium text-slate-900">1,247</span>
                </div>
                <Link href="/analytics">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                    Accedi al Modulo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ISF Management Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Informatori</CardTitle>
                  <CardDescription className="text-slate-600">Gestione ISF</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Sistema commissioni avanzato: 15% revenue-based, gestione 
                  dipendenti vs liberi professionisti con cut-off intelligente.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">ISF attivi:</span>
                  <span className="font-medium text-slate-900">23</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Performance media:</span>
                  <span className="font-medium text-green-600">91.7%</span>
                </div>
                <Link href="/informatori">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                    Accedi al Modulo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Customer Management Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Clienti</CardTitle>
                  <CardDescription className="text-slate-600">CRM Integrato</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Gestione unificata clienti: privati, farmacie, grossisti e medici. 
                  Sistema punti medici e workflow automatizzati.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Nuovi clienti mese:</span>
                  <span className="font-medium text-slate-900">156</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Tasso retention:</span>
                  <span className="font-medium text-green-600">94.2%</span>
                </div>
                <Link href="/customers">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                    Accedi al Modulo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Module */}
          <Card className="group bg-white/70 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-slate-600 to-gray-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Azioni Rapide</CardTitle>
                  <CardDescription className="text-slate-600">Operazioni Frequenti</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <Button variant="outline" className="w-full justify-start text-left hover:bg-slate-50">
                <Clock className="h-4 w-4 mr-3" />
                Ordini in Sospeso
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:bg-slate-50">
                <Truck className="h-4 w-4 mr-3" />
                Spedizioni Oggi
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:bg-slate-50">
                <AlertCircle className="h-4 w-4 mr-3" />
                Alert Sistema
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:bg-slate-50">
                <Award className="h-4 w-4 mr-3" />
                Report Mensile
              </Button>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}