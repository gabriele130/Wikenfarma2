import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users, ShoppingCart, TrendingUp, Award, Euro } from "lucide-react";

type InformatoreDashboardData = {
  informatore: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    territory?: string;
    isActive: boolean;
  };
  assignedDoctors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    city: string;
  }>;
  doctorOrders: Array<{
    id: string;
    orderDate: string;
    status: string;
    total: number;
    customerName?: string;
    customerFirstName?: string;
    customerLastName?: string;
  }>;
  totalPoints: number;
  monthlyStats: {
    orders: number;
    revenue: string;
    points: number;
  };
};

export default function InformatoreDashboard() {
  const { id } = useParams<{ id: string }>();

  const { data: dashboardData, isLoading, error } = useQuery<InformatoreDashboardData>({
    queryKey: ['/api/informatori', id, 'dashboard'],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Caricamento dashboard...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard non trovata</h1>
          <p className="text-gray-600 dark:text-gray-400">L'informatore richiesto non esiste o non è disponibile.</p>
        </div>
      </div>
    );
  }

  const { informatore, assignedDoctors, doctorOrders, totalPoints, monthlyStats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {informatore.firstName} {informatore.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Informatore Medico Scientifico
                {informatore.territory && ` • ${informatore.territory}`}
              </p>
            </div>
            <Badge variant={informatore.isActive ? "default" : "secondary"}>
              {informatore.isActive ? "Attivo" : "Inattivo"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medici Assegnati</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedDoctors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordini del Mese</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyStats.orders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fatturato Mensile</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{Number(monthlyStats.revenue).toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Punti Totali</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalPoints)}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.round(monthlyStats.points)} questo mese
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Doctors */}
          <Card>
            <CardHeader>
              <CardTitle>Medici Assegnati</CardTitle>
              <CardDescription>
                Elenco dei medici sotto la tua responsabilità
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedDoctors.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Nessun medico assegnato
                  </p>
                ) : (
                  assignedDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {doctor.companyName || `${doctor.firstName} ${doctor.lastName}`}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.city} • {doctor.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Ordini Recenti</CardTitle>
              <CardDescription>
                Ultimi ordini dei tuoi medici
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorOrders.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Nessun ordine recente
                  </p>
                ) : (
                  doctorOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {order.customerName || `${order.customerFirstName} ${order.customerLastName}`}
                          </span>
                          <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "outline"}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(order.orderDate).toLocaleDateString('it-IT')}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Euro className="h-3 w-3" />
                            {order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informazioni di Contatto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Email</h4>
                <p className="text-gray-600 dark:text-gray-400">{informatore.email}</p>
              </div>
              {informatore.phone && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Telefono</h4>
                  <p className="text-gray-600 dark:text-gray-400">{informatore.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}