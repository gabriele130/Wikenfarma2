# Script PowerShell per creare tutti i file del progetto WikenFarma
# Esegui questo script nella cartella principale del progetto

Write-Host "Creazione struttura progetto WikenFarma..." -ForegroundColor Green

# Crea le cartelle principali
$folders = @(
    "client\src\components\ui",
    "client\src\lib",
    "client\src\hooks",
    "client\src\pages\orders",
    "server",
    "shared"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force
        Write-Host "Creata cartella: $folder" -ForegroundColor Yellow
    }
}

# === FILE 1: package.json ===
@"
{
  "name": "wikenfarma",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "npx vite",
    "build": "npx vite build",
    "start": "node dist/server/index.js"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.60.5",
    "wouter": "^3.3.5",
    "lucide-react": "^0.453.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.1",
    "@radix-ui/react-slot": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.19",
    "tailwindcss": "^3.4.15",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1"
  }
}
"@ | Out-File -FilePath "package.json" -Encoding UTF8

# === FILE 2: vite.config.ts ===
@"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
"@ | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# === FILE 3: tailwind.config.js ===
@"
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# === FILE 4: postcss.config.js ===
@"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# === FILE 5: tsconfig.json ===
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["client/src/*"]
    }
  },
  "include": ["client/src/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# === FILE 6: client/index.html ===
@"
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WikenFarma - Sistema Gestionale</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@ | Out-File -FilePath "client\index.html" -Encoding UTF8

# === FILE 7: client/src/index.css ===
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
}
"@ | Out-File -FilePath "client\src\index.css" -Encoding UTF8

# === FILE 8: client/src/main.tsx ===
@"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"@ | Out-File -FilePath "client\src\main.tsx" -Encoding UTF8

# === FILE 9: client/src/lib/utils.ts ===
@"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
"@ | Out-File -FilePath "client\src\lib\utils.ts" -Encoding UTF8

# === FILE 10: client/src/components/ui/button.tsx ===
@"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
"@ | Out-File -FilePath "client\src\components\ui\button.tsx" -Encoding UTF8

# === FILE 11: client/src/components/ui/card.tsx ===
@"
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
"@ | Out-File -FilePath "client\src\components\ui\card.tsx" -Encoding UTF8

# === FILE 12: client/src/App.tsx ===
@"
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
                    Bridge farmacie con dati IQVIA e tagging automatico "Farm"
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

function WikishipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">WIKENSHIP - Gestione Ordini Privati</h1>
        <Card>
          <CardHeader>
            <CardTitle>Integrazione WooCommerce/eBay → GestLine + ODOO</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Modulo WIKENSHIP in fase di implementazione...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function PharmaEvoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">PharmaEVO - Bridge Farmacie</h1>
        <Card>
          <CardHeader>
            <CardTitle>Integrazione con dati IQVIA e tagging automatico</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Modulo PharmaEVO in fase di implementazione...</p>
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
"@ | Out-File -FilePath "client\src\App.tsx" -Encoding UTF8

Write-Host "Tutti i file sono stati creati!" -ForegroundColor Green
Write-Host ""
Write-Host "Prossimi passi:" -ForegroundColor Cyan
Write-Host "1. npm install" -ForegroundColor Yellow
Write-Host "2. npx vite" -ForegroundColor Yellow
Write-Host ""
Write-Host "Il progetto sarà disponibile su: http://localhost:5173" -ForegroundColor Magenta