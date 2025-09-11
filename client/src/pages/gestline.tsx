import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, Database, Package, Users, ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface GestLineResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
}

export default function GestLinePage() {
  const [activeTab, setActiveTab] = useState("orders");

  console.log('🔄 [GESTLINE FRONTEND] Initializing GestLine page with POST requests...');

  // Query per ordini - CORRETTO: POST instead of GET
  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError, refetch: refetchOrders } = useQuery<GestLineResponse>({
    queryKey: ['/api/gestline/orders'],
    queryFn: async () => {
      console.log('📡 [GESTLINE FRONTEND] Making POST request to /api/gestline/orders');
      const response = await apiRequest("POST", "/api/gestline/orders", {});
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const data = await response.json();
      console.log('📦 [GESTLINE FRONTEND] Orders response:', data);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  // Query per prodotti - CORRETTO: POST instead of GET
  const { data: productsData, isLoading: isLoadingProducts, error: productsError, refetch: refetchProducts } = useQuery<GestLineResponse>({
    queryKey: ['/api/gestline/products'],
    queryFn: async () => {
      console.log('📡 [GESTLINE FRONTEND] Making POST request to /api/gestline/products');
      const response = await apiRequest("POST", "/api/gestline/products", {});
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      console.log('📦 [GESTLINE FRONTEND] Products response:', data);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  // Query per clienti - CORRETTO: POST instead of GET
  const { data: customersData, isLoading: isLoadingCustomers, error: customersError, refetch: refetchCustomers } = useQuery<GestLineResponse>({
    queryKey: ['/api/gestline/customers'],
    queryFn: async () => {
      console.log('📡 [GESTLINE FRONTEND] Making POST request to /api/gestline/customers');
      const response = await apiRequest("POST", "/api/gestline/customers", {});
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }
      const data = await response.json();
      console.log('📦 [GESTLINE FRONTEND] Customers response:', data);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  const ResponseCard = ({ 
    title, 
    data, 
    isLoading, 
    error, 
    onRefresh, 
    icon: Icon 
  }: {
    title: string;
    data?: GestLineResponse;
    isLoading: boolean;
    error: any;
    onRefresh: () => void;
    icon: any;
  }) => (
    <Card className="h-full" data-testid={`card-gestline-${title.toLowerCase()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          data-testid={`button-refresh-${title.toLowerCase()}`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8" data-testid={`loading-${title.toLowerCase()}`}>
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Caricamento dati GestLine...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" data-testid={`error-${title.toLowerCase()}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Errore nel caricamento: {error.message}
            </AlertDescription>
          </Alert>
        ) : data ? (
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2" data-testid={`status-${title.toLowerCase()}`}>
              {data.success ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Successo
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Errore
                </Badge>
              )}
              {data.statusCode && (
                <Badge variant="outline">
                  HTTP {data.statusCode}
                </Badge>
              )}
            </div>

            {/* Response Data */}
            {data.success && data.data ? (
              <div data-testid={`data-${title.toLowerCase()}`}>
                <h4 className="text-sm font-medium mb-2">Dati Ricevuti:</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : data.error && (
              <div data-testid={`error-message-${title.toLowerCase()}`}>
                <h4 className="text-sm font-medium mb-2 text-red-600">Messaggio di Errore:</h4>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                    {data.error}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500" data-testid={`no-data-${title.toLowerCase()}`}>
            Nessun dato disponibile
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" data-testid="page-gestline">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="title-gestline">
            GestLine ERP
          </h1>
          <p className="text-gray-600 dark:text-gray-400" data-testid="subtitle-gestline">
            Risultati delle chiamate GET alle API GestLine
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            API: 2.40.69.204:50200
          </Badge>
        </div>
      </div>

      {/* Tabs per diverse sezioni */}
      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-gestline">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" data-testid="tab-orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ordini
          </TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">
            <Package className="h-4 w-4 mr-2" />
            Prodotti
          </TabsTrigger>
          <TabsTrigger value="customers" data-testid="tab-customers">
            <Users className="h-4 w-4 mr-2" />
            Clienti
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <ResponseCard
            title="Ordini"
            data={ordersData}
            isLoading={isLoadingOrders}
            error={ordersError}
            onRefresh={refetchOrders}
            icon={ShoppingCart}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ResponseCard
            title="Prodotti"
            data={productsData}
            isLoading={isLoadingProducts}
            error={productsError}
            onRefresh={refetchProducts}
            icon={Package}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <ResponseCard
            title="Clienti"
            data={customersData}
            isLoading={isLoadingCustomers}
            error={customersError}
            onRefresh={refetchCustomers}
            icon={Users}
          />
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Endpoint API:</strong> https://2.40.69.204:50200/api_gestline</p>
            <p><strong>Autenticazione:</strong> Basic Auth (configurata)</p>
            <p><strong>Formato Risposta:</strong> JSON/XML automatico</p>
            <p><strong>Note:</strong> I dati mostrati sono i risultati diretti delle chiamate GET al sistema GestLine ERP</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}