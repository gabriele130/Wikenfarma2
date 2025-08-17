import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  userType?: "standard" | "informatore" | "both";
  role?: string[];
}

export function ProtectedRoute({
  path,
  component: Component,
  userType = "both",
  role = [],
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-slate-600">Caricamento in corso...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check user type if specified
  if (userType !== "both" && user.userType !== userType) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-red-600">Accesso Negato</h1>
            <p className="text-slate-600">
              Non sei autorizzato ad accedere a questa sezione.
            </p>
            <p className="text-sm text-slate-500">
              Questa area è riservata agli utenti di tipo: {userType}
            </p>
          </div>
        </div>
      </Route>
    );
  }

  // Check role if specified
  if (role.length > 0 && !role.includes(user.role || "")) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-red-600">Accesso Negato</h1>
            <p className="text-slate-600">
              Non hai i privilegi necessari per accedere a questa sezione.
            </p>
            <p className="text-sm text-slate-500">
              Ruoli richiesti: {role.join(", ")}
            </p>
          </div>
        </div>
      </Route>
    );
  }

  return <Component />;
}