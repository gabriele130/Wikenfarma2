import { useState } from "react";
import { useGlobalSearch, type SearchResult } from "../../hooks/use-global-search";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  Plus, 
  Settings,
  Moon,
  Sun,
  User,
  ChevronDown,
  ShoppingCart,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Package
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ModernHeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function ModernHeader({ 
  title = "Dashboard", 
  subtitle = "Panoramica del sistema",
  onToggleSidebar,
  isSidebarCollapsed = false
}: ModernHeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [, setLocation] = useLocation();
  
  const { results, isLoading } = useGlobalSearch(searchQuery);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleSearchResultClick = (result: SearchResult) => {
    setLocation(result.route);
    setShowSearchResults(false);
    setSearchQuery("");
  };
  
  const getResultIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="h-4 w-4" />;
      case 'package': return <Package className="h-4 w-4" />;
      case 'shopping-cart': return <ShoppingCart className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const notifications = [
    { id: 1, title: "Nuovo ordine ricevuto", time: "2 min fa", unread: true },
    { id: 2, title: "Stock basso: Aspirina", time: "1 ora fa", unread: true },
    { id: 3, title: "Spedizione completata", time: "3 ore fa", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Titolo */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden p-2.5 hover:bg-slate-100 rounded-lg mr-2"
              data-testid="mobile-menu-button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 truncate">
              {title}
            </h1>
            {user?.userType === "informatore" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ISF
              </Badge>
            )}
          </div>
            <p className="text-sm text-slate-500 mt-1 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Barra di ricerca */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Cerca clienti, prodotti, ordini..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300"
              data-testid="global-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length >= 2);
              }}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            
            {/* Risultati Ricerca */}
            {showSearchResults && (results.length > 0 || isLoading) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-slate-500">
                    <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Ricerca in corso...
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg text-left transition-colors"
                        data-testid={`search-result-${result.type}-${result.id}`}
                      >
                        <div className="flex-shrink-0 text-slate-400">
                          {getResultIcon(result.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-xs text-slate-500 truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 capitalize">
                          {result.type}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500">
                    Nessun risultato trovato
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Azioni Header */}
        <div className="flex items-center space-x-4">
          {/* Pulsante Ricerca Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2.5 hover:bg-slate-100 rounded-lg"
            data-testid="mobile-search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Nuovo Ordine - Quick Action */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2"
            data-testid="new-order-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nuovo Ordine</span>
          </Button>

          {/* Notifiche */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2.5 hover:bg-slate-100 rounded-lg"
                data-testid="notifications-button"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifiche
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} nuove
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <p className={`text-sm ${notification.unread ? 'font-medium' : 'text-slate-600'}`}>
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profilo Utente */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-slate-100 rounded-lg ml-2"
                data-testid="user-menu-button"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.userType === "informatore" ? "Informatore" : user?.role || "Utente"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profilo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Impostazioni
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {darkMode ? "Modalità Chiara" : "Modalità Scura"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
                data-testid="logout-menu-item"
              >
                Esci
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}