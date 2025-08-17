import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Package, User, Calendar, CreditCard } from "lucide-react"
import { Link, useParams } from "wouter"

export default function OrderDetails() {
  const { id } = useParams()

  // Mock order data
  const order = {
    id: id || "1",
    customer: "Farmacia Centrale",
    customerEmail: "info@farmaciacentrale.it",
    amount: 245.50,
    status: "completed",
    date: "2024-01-15",
    items: [
      { name: "Aspirina 500mg", quantity: 2, price: 12.50 },
      { name: "Paracetamolo 1000mg", quantity: 1, price: 8.90 },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ordine #{order.id}</h1>
          <p className="text-slate-600">Dettagli dell'ordine selezionato</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Prodotti Ordinati</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Quantità: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">€{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-slate-600">€{item.price} cad.</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-slate-900">{order.customer}</p>
                <p className="text-sm text-slate-600">{order.customerEmail}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Informazioni Ordine</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Data Ordine</p>
                <p className="font-medium text-slate-900">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Stato</p>
                <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                  {order.status === "completed" ? "Completato" : "In elaborazione"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600">Totale</p>
                <p className="text-xl font-bold text-slate-900">€{order.amount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}