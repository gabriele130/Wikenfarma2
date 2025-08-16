import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

export default function OrdersPrivate() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ordini Privati</h1>
          <p className="mt-2 text-gray-600">Gestione ordini da clienti privati</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista Ordini</CardTitle>
            <CardDescription>Ordini ricevuti da clienti privati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">#ORD-001</div>
                  <div className="text-sm text-gray-600">Mario Rossi</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">In elaborazione</Badge>
                  <Button size="sm">Visualizza</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}