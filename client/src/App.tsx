import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch, Link } from 'wouter'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  ShoppingCart, 
  BarChart3,
  Truck,
  FileText,
  UserCheck,
  Building2,
  Pill
} from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Pill className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">WikenFarma</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/wikenship" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                WIKENSHIP
              </Link>
              <Link href="/pharmaevo" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                PharmaEVO
              </Link>
              <Link href="/analytics" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Analytics
              </Link>
              <Link href="/informatori" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Informatori
              </Link>
              <Link href="/customers" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Clienti
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Principale
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema gestionale completo per operazioni farmaceutiche
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/wikenship">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <CardTitle>WIKENSHIP</CardTitle>
                  </div>
                  <CardDescription>
                    Integrazione WooCommerce/eBay → GestLine + ODOO con analytics completa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Sincronizzazione ordini privati</div>
                    <div>• Bridge verso GestLine frontier</div>
                    <div>• Analytics ODOO integrate</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/pharmaevo">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <CardTitle>PharmaEVO</CardTitle>
                  </div>
                  <CardDescription>
                    Bridge farmacie con dati IQVIA e tagging automatico Farm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Integrazione dati IQVIA</div>
                    <div>• Tagging automatico ordini</div>
                    <div>• Sincronizzazione GestLine</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/analytics">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <CardTitle>Analytics</CardTitle>
                  </div>
                  <CardDescription>
                    Dashboard multi-dimensionale con confronti temporali avanzati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Analisi ricavi per fonte</div>
                    <div>• Comparazioni temporali</div>
                    <div>• Metriche performance ISF</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/informatori">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-orange-600" />
                    <CardTitle>Gestione ISF</CardTitle>
                  </div>
                  <CardDescription>
                    Sistema completo per Informatori Scientifici con commissioni
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Dipendenti vs Liberi Prof.</div>
                    <div>• Commissioni 15% revenue</div>
                    <div>• Sistemi punti medici</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/customers">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <CardTitle>Clienti</CardTitle>
                  </div>
                  <CardDescription>
                    Gestione completa clienti: privati, farmacie, grossisti, medici
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Database clienti unificato</div>
                    <div>• Segmentazione automatica</div>
                    <div>• Storico relazioni</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/inventory">
            <div>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-red-600" />
                    <CardTitle>Inventario</CardTitle>
                  </div>
                  <CardDescription>
                    Controllo magazzino con soglie automatiche e riordini
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Controllo stock real-time</div>
                    <div>• Soglie riordino automatiche</div>
                    <div>• Gestione scadenze</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Metriche Rapide</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">€24,560</div>
                  <div className="text-sm text-gray-600">Ricavi Mensili</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">187</div>
                  <div className="text-sm text-gray-600">Ordini Attivi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">ISF Attivi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-gray-600">Sync Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Azioni Rapide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Truck className="h-4 w-4 mr-2" />
                Sincronizza Spedizioni
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Genera Report Mensile
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Controlla Stock Critico
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Import delle pagine dalle loro posizioni corrette
import WikishipPage from './pages/wikenship'
import PharmaEvoPage from './pages/pharmaevo'
import AnalyticsPage from './pages/analytics'
import InformatoriPage from './pages/informatori'
import CustomersPage from './pages/customers'

function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventario</h1>
        <Card>
          <CardHeader>
            <CardTitle>Controllo magazzino con soglie automatiche e riordini</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Modulo Inventario in fase di implementazione...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/wikenship" component={WikishipPage} />
        <Route path="/pharmaevo" component={PharmaEvoPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/informatori" component={InformatoriPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card>
              <CardHeader>
                <CardTitle>404 - Pagina non trovata</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button>Torna alla Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  )
}

export default App