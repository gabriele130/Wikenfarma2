import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <Pill className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-4">
              WikenFarma
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Sistema Gestionale Farmaceutico di Nuova Generazione
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">5</div>
                <div className="text-sm text-slate-600">Moduli Attivi</div>
              </div>
              <div className="h-8 w-px bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
              <div className="h-8 w-px bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-slate-600">Monitoraggio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
      </div>

      {/* Main Modules Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Moduli Sistema</h2>
          <p className="text-slate-600">Accesso rapido alle funzionalità principali</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                  Accedi al Modulo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                  Accedi al Modulo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                  Accedi al Modulo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                  Accedi al Modulo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 group-hover:shadow-lg transition-all duration-300">
                  Accedi al Modulo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
  )
}