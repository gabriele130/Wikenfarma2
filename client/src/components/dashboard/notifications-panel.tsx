import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface NotificationsPanelProps {
  lowStockProducts: Product[];
}

export default function NotificationsPanel({ lowStockProducts }: NotificationsPanelProps) {
  // Generate sample notifications from low stock products
  const notifications = [
    ...lowStockProducts.slice(0, 2).map(product => ({
      id: product.id,
      type: "warning" as const,
      icon: "fas fa-exclamation-triangle",
      title: "Prodotto in esaurimento",
      message: `${product.name} ha solo ${product.stock} unità rimanenti`,
      time: "10 min fa",
      color: "bg-red-50"
    })),
    {
      id: "sync-complete",
      type: "info" as const,
      icon: "fas fa-info-circle",
      title: "Sincronizzazione completata",
      message: "Dati Odoo aggiornati con successo",
      time: "1h fa",
      color: "bg-blue-50"
    }
  ];

  const iconColors = {
    warning: "text-error",
    error: "text-error",
    info: "text-info",
    success: "text-success",
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notifiche</CardTitle>
          {notifications.length > 0 && (
            <Badge variant="destructive" className="bg-error text-white">
              {notifications.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nessuna notifica
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${notification.color}`}
            >
              <div className="flex-shrink-0">
                <i className={`${notification.icon} ${iconColors[notification.type]}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
