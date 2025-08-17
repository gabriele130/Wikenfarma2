import { useState } from "react"
import { Button } from "../ui/button"
import { LogOut, Moon, Sun, BarChart3, Users, Package, ShoppingCart, Home, FileText, Settings, TrendingUp } from "lucide-react"
import { Link, useLocation } from "wouter"
import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [location] = useLocation()
  const { user, logoutMutation } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const root = window.document.documentElement;
    if (!isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Clienti", href: "/customers", icon: Users, current: location === "/customers" },
    { name: "Inventario", href: "/inventory", icon: Package, current: location === "/inventory" },
    { name: "Ordini", href: "/orders", icon: ShoppingCart, current: location === "/orders" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WikenFarma
            </h1>
            {user && (
              <div className="text-sm text-slate-600">
                Benvenuto, <span className="font-semibold">{user.firstName} {user.lastName}</span>
                {user.userType === "informatore" && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Informatore
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 bg-white/50 hover:bg-white/70"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="bg-white/50 hover:bg-white/70"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Disconnessione..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-1 mb-8 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} to={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  item.current 
                    ? "bg-white shadow-sm text-blue-600 border border-blue-200/50" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}>
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </a>
              </Link>
            )
          })}
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}