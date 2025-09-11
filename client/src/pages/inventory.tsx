import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ModernSidebar from "@/components/layout/modern-sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Inventory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Non autorizzato",
        description: "Stai per essere reindirizzato alla pagina di accesso...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { page, search }],
    retry: false,
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/products/low-stock"],
    retry: false,
  });

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return { label: "Esaurito", color: "bg-error text-white", icon: "fas fa-times-circle" };
    if (stock <= minStock) return { label: "Scorte basse", color: "bg-warning text-white", icon: "fas fa-exclamation-triangle" };
    return { label: "Disponibile", color: "bg-success text-white", icon: "fas fa-check-circle" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-pills text-white text-2xl"></i>
          </div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ModernSidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Magazzino" subtitle="Gestione inventario e scorte" />
        
        <div className="p-6 space-y-6">
          {/* Low Stock Alert */}
          {lowStockProducts && lowStockProducts.length > 0 && (
            <Alert className="border-warning bg-warning bg-opacity-10">
              <i className="fas fa-exclamation-triangle text-warning"></i>
              <AlertDescription>
                <strong>Attenzione:</strong> {lowStockProducts.length} prodotti hanno scorte basse o sono esauriti.
              </AlertDescription>
            </Alert>
          )}

          {/* Inventory Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prodotti Totali</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {productsData?.total || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-boxes text-primary text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scorte Basse</p>
                  <p className="text-3xl font-bold text-warning">
                    {lowStockProducts?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-warning text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valore Magazzino</p>
                  <p className="text-3xl font-bold text-success">€--</p>
                  <p className="text-sm text-gray-500">Da calcolare</p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-euro-sign text-success text-xl"></i>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Movimenti Oggi</p>
                  <p className="text-3xl font-bold text-info">--</p>
                  <p className="text-sm text-gray-500">Da implementare</p>
                </div>
                <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exchange-alt text-info text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Inventario Prodotti</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <i className="fas fa-download mr-2"></i>
                    Esporta
                  </Button>
                  <Button className="bg-primary hover:bg-blue-700">
                    <i className="fas fa-plus mr-2"></i>
                    Nuovo Prodotto
                  </Button>
                </div>
              </div>
              
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Cerca per nome, codice o categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {productsLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Caricamento prodotti...</p>
                </div>
              ) : !productsData?.products?.length ? (
                <div className="text-center py-8">
                  <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nessun prodotto trovato</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prodotto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Codice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scorte
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prezzo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productsData.products.map((product) => {
                        const stockStatus = getStockStatus(product.stock || 0, product.minStock || 0);
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.category || "Non categorizzato"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">{product.stock || 0}</span> disponibili
                              </div>
                              <div className="text-sm text-gray-500">
                                Min: {product.minStock || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              €{parseFloat(product.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={stockStatus.color}>
                                <i className={`${stockStatus.icon} mr-1`}></i>
                                {stockStatus.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Button variant="ghost" size="sm">
                                <i className="fas fa-edit mr-1"></i>
                                Modifica
                              </Button>
                              <Button variant="ghost" size="sm">
                                <i className="fas fa-history mr-1"></i>
                                Movimenti
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
