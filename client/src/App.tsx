import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch, Link } from 'wouter'
import { Pill } from 'lucide-react'

// Import delle pagine
import Dashboard from './pages/dashboard'
import Analytics from './pages/analytics'

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
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Pill className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                WikenFarma
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/wikenship" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                WIKENSHIP
              </Link>
              <Link 
                href="/pharmaevo" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                PharmaEVO
              </Link>
              <Link 
                href="/analytics" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Analytics
              </Link>
              <Link 
                href="/informatori" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Informatori
              </Link>
              <Link 
                href="/customers" 
                className="border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Clienti
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <Navigation />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Pagina Non Trovata</h1>
        <p className="text-slate-600 mb-8">La pagina che stai cercando non esiste.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Torna alla Dashboard
        </Link>
      </div>
    </div>
  )
}

function WikishipPlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">WIKENSHIP</h1>
        <p className="text-slate-600">Modulo in fase di sviluppo...</p>
      </div>
    </div>
  )
}

function PharmaevoPlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">PharmaEVO</h1>
        <p className="text-slate-600">Modulo in fase di sviluppo...</p>
      </div>
    </div>
  )
}

function InformatoriPlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Gestione Informatori</h1>
        <p className="text-slate-600">Modulo in fase di sviluppo...</p>
      </div>
    </div>
  )
}

function CustomersPlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Gestione Clienti</h1>
        <p className="text-slate-600">Modulo in fase di sviluppo...</p>
      </div>
    </div>
  )
}

function AnalyticsWithNav() {
  return (
    <div>
      <Navigation />
      <Analytics />
    </div>
  )
}

function DashboardWithNav() {
  return (
    <div>
      <Navigation />
      <Dashboard />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={DashboardWithNav} />
        <Route path="/analytics" component={AnalyticsWithNav} />
        <Route path="/wikenship" component={WikishipPlaceholder} />
        <Route path="/pharmaevo" component={PharmaevoPlaceholder} />
        <Route path="/informatori" component={InformatoriPlaceholder} />
        <Route path="/customers" component={CustomersPlaceholder} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  )
}