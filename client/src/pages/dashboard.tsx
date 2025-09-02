import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Link } from "wouter"
import { useAuth } from "../hooks/use-auth"
import { 
  TrendingUp, 
  Package, 
  Users, 
  BarChart3, 
  ShoppingCart,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
  UserCheck,
  ArrowRight,
  Pill
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
    </div>
  )
}