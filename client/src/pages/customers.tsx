import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Users } from "lucide-react"

export default function Customers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clienti</h1>
          <p className="mt-2 text-gray-600">Gestione completa clienti: privati, farmacie, grossisti, medici</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle>Clienti Privati</CardTitle>
              </div>
              <CardDescription>
                Database clienti privati con storico acquisti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>• 2,450 clienti registrati</div>
                <div>• Segmentazione per area</div>
                <div>• Storico acquisti completo</div>
              </div>
              <Button>Gestisci Clienti</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}