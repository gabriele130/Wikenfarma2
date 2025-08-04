import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { OrderWithDetails } from "@shared/schema";

interface RecentOrdersProps {
  orders: OrderWithDetails[];
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-success bg-opacity-10 text-success",
  processing: "bg-warning bg-opacity-10 text-warning",
  shipped: "bg-info bg-opacity-10 text-info",
  delivered: "bg-success bg-opacity-10 text-success",
  cancelled: "bg-error bg-opacity-10 text-error",
};

const statusLabels = {
  pending: "In Attesa",
  confirmed: "Confermato",
  processing: "In Lavorazione",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Ordini Recenti</CardTitle>
          <Link href="/orders/private">
            <a className="text-primary hover:text-blue-700 text-sm font-medium">
              Vedi tutti
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nessun ordine recente
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.orderDate!).toLocaleDateString("it-IT")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customer?.companyName || 
                         `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
                         "Cliente sconosciuto"}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {order.customerType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={statusColors[order.status as keyof typeof statusColors] || statusColors.pending}
                      >
                        {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{parseFloat(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
