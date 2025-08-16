import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { BarChart3, TrendingUp, PieChart, Calendar, Package, Users } from "lucide-react"

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Dashboard multi-dimensionale con confronti temporali avanzati
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ricavi Totali</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€342,560</div>
              <p className="text-xs text-muted-foreground">+12.5% vs mese scorso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance ISF</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">Target raggiungimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuovi Clienti</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23% acquisizione</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversione</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.7%</div>
              <p className="text-xs text-muted-foreground">Lead to customer</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Analisi Ricavi per Fonte</CardTitle>
              <CardDescription>Distribuzione fatturato per canale di vendita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>WIKENSHIP (WooCommerce/eBay)</span>
                  </div>
                  <div className="font-bold">€145,230 (42.4%)</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>PharmaEVO (Farmacie)</span>
                  </div>
                  <div className="font-bold">€127,890 (37.3%)</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span>Vendita Diretta</span>
                  </div>
                  <div className="font-bold">€52,340 (15.3%)</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span>Partnership Medici</span>
                  </div>
                  <div className="font-bold">€17,100 (5.0%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trend Mensile</CardTitle>
              <CardDescription>Comparazione ultimi 6 mesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gennaio 2025</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-20 h-2 bg-blue-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">€298,450</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dicembre 2024</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-24 h-2 bg-green-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">€342,560</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Novembre 2024</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-16 h-2 bg-blue-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">€267,890</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top ISF Performance</CardTitle>
              <CardDescription>Classifica informatori scientifici</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Marco Rossi</div>
                    <div className="text-sm text-gray-600">Nord Italia</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">€89,450</div>
                    <div className="text-sm text-gray-600">142% target</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Laura Bianchi</div>
                    <div className="text-sm text-gray-600">Centro Italia</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">€76,230</div>
                    <div className="text-sm text-gray-600">125% target</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Giuseppe Verde</div>
                    <div className="text-sm text-gray-600">Sud Italia</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">€65,890</div>
                    <div className="text-sm text-gray-600">108% target</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prodotti Best Seller</CardTitle>
              <CardDescription>Top 5 prodotti per volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Cardioaspirin 100mg</span>
                  <span className="font-medium">2,347 unità</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tachipirina 1000mg</span>
                  <span className="font-medium">1,892 unità</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Moment Act 400mg</span>
                  <span className="font-medium">1,567 unità</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bentelan 4mg</span>
                  <span className="font-medium">1,234 unità</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Voltaren Gel</span>
                  <span className="font-medium">989 unità</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
              <CardDescription>Report e operazioni frequenti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Report Vendite
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Analisi Clienti
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Performance Prodotti
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Forecast Vendite
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}