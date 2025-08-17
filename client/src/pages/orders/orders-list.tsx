import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { ShoppingCart, Plus, Search } from "lucide-react"

const mockOrders = [
  { id: "1", customer: "Farmacia Centrale", amount: 245.50, status: "completed", date: "2024-01-15" },
  { id: "2", customer: "Dr. Mario Rossi", amount: 89.90, status: "pending", date: "2024-01-14" },
  { id: "3", customer: "Farmacia San Giuseppe", amount: 345.20, status: "shipped", date: "2024-01-14" },
  { id: "4", customer: "Farmacia Comunale", amount: 678.30, status: "completed", date: "2024-01-13" },
  { id: "5", customer: "Dr. Anna Verdi", amount: 156.75, status: "pending", date: "2024-01-13" },
]

export default function OrdersList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestione Ordini</h1>
          <p className="text-slate-600">Visualizza e gestisci tutti gli ordini del sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Ordine
        </Button>
      </div>

      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Lista Ordini</span>
          </CardTitle>
          <CardDescription>
            Tutti gli ordini ricevuti nel sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">{order.customer}</p>
                  <p className="text-sm text-slate-600">Ordine #{order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">€{order.amount}</p>
                  <Badge 
                    variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "outline"}
                    className="mt-1"
                  >
                    {order.status === "completed" ? "Completato" : 
                     order.status === "pending" ? "In attesa" : "Spedito"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}