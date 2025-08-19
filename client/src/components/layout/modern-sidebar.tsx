import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Percent, 
  Plug, 
  Truck, 
  UserCheck, 
  Settings, 
  LogOut,
  ChevronDown,
  Building2,
  Pill,
  Stethoscope,
  Bell,
  User,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// Menu items moderni con icone Lucide e descrizioni
const menuItems = [
  { 
    path: "/", 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    section: "main",
    description: "Panoramica generale",
    badge: null
  },
  { 
    path: "/customers", 
    icon: Users, 
    label: "Clienti", 
    section: "main",
    description: "Farmacie, grossisti, medici",
    badge: null
  },
  { 
    path: "/inventory", 
    icon: Package, 
    label: "Inventario", 
    section: "main",
    description: "Prodotti e scorte",
    badge: "12"
  },
  { 
    path: "/orders", 
    icon: ShoppingCart, 
    label: "Ordini", 
    section: "main",
    description: "Gestione ordini",
    badge: "3"
  },
  
  { 
    path: "/analytics", 
    icon: BarChart3, 
    label: "Analytics", 
    section: "business",
    description: "Metriche e performance",
    badge: null
  },
  { 
    path: "/reports", 
    icon: FileText, 
    label: "Reports", 
    section: "business",
    description: "Reportistica avanzata",
    badge: null
  },
  { 
    path: "/commissions", 
    icon: Percent, 
    label: "Commissioni", 
    section: "business",
    description: "Calcolo compensi ISF",
    badge: null
  },
  
  { 
    path: "/integrations", 
    icon: Plug, 
    label: "Integrazioni", 
    section: "system",
    description: "eBay, Gestline, PharmaEVO",
    badge: null
  },
  { 
    path: "/shipping", 
    icon: Truck, 
    label: "Spedizioni", 
    section: "system",
    description: "Logistica e tracking",
    badge: null
  },
  { 
    path: "/informatori", 
    icon: UserCheck, 
    label: "Informatori", 
    section: "system",
    description: "Gestione ISF",
    badge: null
  },
];

// Sezioni del menu modernizzate
const sections = [
  { key: "main", title: "Operazioni", icon: Building2, expanded: true },
  { key: "business", title: "Business Intelligence", icon: BarChart3, expanded: false },
  { key: "system", title: "Sistema", icon: Settings, expanded: false }
];

interface ModernSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function ModernSidebar({ isCollapsed = false, onToggle }: ModernSidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    business: false,
    system: false
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const renderMenuItem = (item: typeof menuItems[0], isCollapsed: boolean) => {
    const isActive = location === item.path;
    const Icon = item.icon;
    
    return (
      <Link key={item.path} href={item.path}>
        <div 
          className={`group relative flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-3 py-2.5'} rounded-lg cursor-pointer transition-all duration-200 ${
            isActive 
              ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
          data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
          title={isCollapsed ? item.label : undefined}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 flex-1 min-w-0'}`}>
            <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                  {item.label}
                </p>
                <p className={`text-xs truncate ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                  {item.description}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && item.badge && (
            <Badge variant={isActive ? "default" : "secondary"} className="h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
          {isCollapsed && item.badge && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
      </Link>
    );
  };

  const renderSection = (section: typeof sections[0], isCollapsed: boolean) => {
    const sectionItems = menuItems.filter(item => item.section === section.key);
    const isExpanded = expandedSections[section.key];
    const SectionIcon = section.icon;
    
    if (sectionItems.length === 0) return null;

    if (isCollapsed) {
      return (
        <div key={section.key} className="space-y-1">
          <div className="flex justify-center py-2">
            <div className="w-6 h-px bg-slate-300"></div>
          </div>
          {sectionItems.map(item => renderMenuItem(item, isCollapsed))}
        </div>
      );
    }

    return (
      <Collapsible key={section.key} open={isExpanded} onOpenChange={() => toggleSection(section.key)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-3 py-2 h-auto text-left font-normal hover:bg-slate-50"
            data-testid={`section-${section.key}`}
          >
            <div className="flex items-center space-x-2">
              <SectionIcon className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </span>
            </div>
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-180' : ''
            }`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-1 pb-2">
          {sectionItems.map(item => renderMenuItem(item, isCollapsed))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} h-full bg-white border-r border-slate-200 flex flex-col shadow-sm transition-all duration-300`}>
      {/* Header con Logo */}
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-slate-200`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Pill className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">WikenFarma</h1>
              <p className="text-xs text-slate-500 truncate">Sistema Gestionale Farmaceutico</p>
            </div>
          )}
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={`${isCollapsed ? 'absolute top-3 right-3 lg:hidden' : 'p-1 h-6 w-6 lg:hidden'}`}
              data-testid="sidebar-toggle"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Navigazione */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-2 overflow-y-auto`}>
        {sections.map(section => renderSection(section, isCollapsed))}
      </nav>

      {/* Sezione Aiuto */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-left font-normal hover:bg-slate-50"
            data-testid="help-button"
          >
            <HelpCircle className="h-4 w-4 text-slate-400 mr-3" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-700">Aiuto & Supporto</p>
              <p className="text-xs text-slate-400">Documentazione e FAQ</p>
            </div>
          </Button>
        </div>
      )}

      {isCollapsed && (
        <div className="px-2 py-2">
          <Button
            variant="ghost"
            className="w-full justify-center px-3 py-3 h-auto hover:bg-slate-50"
            data-testid="help-button-collapsed"
            title="Aiuto & Supporto"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      )}

      <Separator />

      {/* Profilo Utente */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-slate-100 text-slate-600">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  {user?.userType === "informatore" ? "Informatore" : user?.role || "Utente"}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 h-auto hover:bg-red-50 hover:text-red-600"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-slate-100 text-slate-600">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 h-auto hover:bg-red-50 hover:text-red-600"
              data-testid="logout-button-collapsed"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}