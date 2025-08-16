import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { UserCheck } from "lucide-react"

export default function Informatori() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestione ISF</h1>
          <p className="mt-2 text-gray-600">Sistema completo per Informatori Scientifici con commissioni</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-orange-600" />
                <CardTitle>Informatori Attivi</CardTitle>
              </div>
              <CardDescription>
                Gestione completa del team ISF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>• 12 ISF attivi</div>
                <div>• Sistema commissioni 15%</div>
                <div>• Tracking performance</div>
              </div>
              <Button>Visualizza Team</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}