import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { path: "/", label: "Dashboard", icon: "fas fa-tachometer-alt", section: "main" },
  { path: "/orders/private", label: "Ordini Privati", icon: "fas fa-user", section: "orders" },
  { path: "/orders/pharmacy", label: "Ordini Farmacie", icon: "fas fa-clinic-medical", section: "orders" },
  { path: "/orders/wholesale", label: "Ordini Grossisti", icon: "fas fa-warehouse", section: "orders" },
  { path: "/customers", label: "Clienti", icon: "fas fa-users", section: "registry" },
  { path: "/doctors", label: "Medici", icon: "fas fa-user-md", section: "registry" },
  { path: "/inventory", label: "Magazzino", icon: "fas fa-boxes", section: "operations" },
  { path: "/shipping", label: "Spedizioni", icon: "fas fa-shipping-fast", section: "operations" },
  { path: "/commissions", label: "Provvigioni", icon: "fas fa-percentage", section: "operations" },
  { path: "/reports", label: "Report", icon: "fas fa-chart-bar", section: "analysis" },
  { path: "/integrations", label: "Integrazioni", icon: "fas fa-plug", section: "analysis" },
];

const sections = {
  main: "",
  orders: "Gestione Ordini",
  registry: "Anagrafiche",
  operations: "Operazioni",
  analysis: "Analisi",
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const renderMenuSection = (sectionKey: string) => {
    const sectionItems = menuItems.filter(item => item.section === sectionKey);
    
    return (
      <div key={sectionKey} className="space-y-1">
        {sections[sectionKey as keyof typeof sections] && (
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {sections[sectionKey as keyof typeof sections]}
          </div>
        )}
        {sectionItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a className={`flex items-center px-4 py-3 text-sm transition-colors rounded-lg ${
                isActive 
                  ? "text-primary bg-blue-50 border-l-4 border-primary font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                <i className={`${item.icon} w-5 h-5 mr-3`}></i>
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-pills text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">WikenFarma</h1>
            <p className="text-sm text-gray-500">Sistema Gestionale</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {Object.keys(sections).map(renderMenuSection)}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <i className="fas fa-user text-gray-600"></i>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || "Utente"
              }
            </p>
            <p className="text-sm text-gray-500">
              {user?.role === "admin" ? "Amministratore" : "Utente"}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = "/api/logout"}
            className="text-gray-400 hover:text-gray-600"
            title="Esci"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
