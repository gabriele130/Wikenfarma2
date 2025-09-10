// GestLine API Service - Integrazione con sistema ERP GestLine
// Gestisce le chiamate POST con autenticazione Basic

export interface GestLineApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
}

export interface GestLineOrderData {
  // Campi ordine per GestLine 
  orderNumber: string;
  customerData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    productCode: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  notes?: string;
}

export class GestLineService {
  private apiUrl: string;
  private username: string;
  private password: string;
  private authHeader: string;

  constructor() {
    this.apiUrl = process.env.GESTLINE_API_URL || '';
    this.username = process.env.GESTLINE_API_USERNAME || '';
    this.password = process.env.GESTLINE_API_PASSWORD || '';
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Invia un ordine a GestLine via API POST
   */
  async sendOrder(orderData: GestLineOrderData): Promise<GestLineApiResponse> {
    try {
      console.log(`🔄 Sending order to GestLine: ${orderData.orderNumber}`);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData),
        // Ignore SSL certificate issues for internal APIs
        rejectUnauthorized: false
      } as any);

      const statusCode = response.status;
      let responseData;

      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      if (response.ok) {
        console.log(`✅ Order sent to GestLine successfully: ${orderData.orderNumber}`);
        return {
          success: true,
          data: responseData,
          statusCode
        };
      } else {
        console.error(`❌ GestLine API error (${statusCode}):`, responseData);
        return {
          success: false,
          error: `API Error ${statusCode}: ${responseData}`,
          statusCode
        };
      }
    } catch (error) {
      console.error('❌ GestLine API connection error:', error);
      return {
        success: false,
        error: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
        statusCode: 0
      };
    }
  }

  /**
   * Sincronizza un prodotto con GestLine
   */
  async syncProduct(productData: any): Promise<GestLineApiResponse> {
    try {
      console.log(`🔄 Syncing product to GestLine: ${productData.code}`);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'sync_product',
          product: productData
        }),
        rejectUnauthorized: false
      } as any);

      const statusCode = response.status;
      const responseData = await response.json();

      if (response.ok) {
        console.log(`✅ Product synced to GestLine: ${productData.code}`);
        return {
          success: true,
          data: responseData,
          statusCode
        };
      } else {
        console.error(`❌ GestLine product sync error (${statusCode}):`, responseData);
        return {
          success: false,
          error: `Sync Error ${statusCode}: ${responseData}`,
          statusCode
        };
      }
    } catch (error) {
      console.error('❌ GestLine product sync error:', error);
      return {
        success: false,
        error: `Sync error: ${error instanceof Error ? error.message : String(error)}`,
        statusCode: 0
      };
    }
  }

  /**
   * Recupera dati da GestLine via GET
   */
  async getData(endpoint: string = ''): Promise<GestLineApiResponse> {
    try {
      console.log(`🔄 Getting data from GestLine: ${endpoint}`);
      
      const url = endpoint ? `${this.apiUrl}/${endpoint}` : this.apiUrl;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        },
        rejectUnauthorized: false
      } as any);

      const statusCode = response.status;
      let responseData;

      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      if (response.ok) {
        console.log(`✅ Data retrieved from GestLine successfully`);
        return {
          success: true,
          data: responseData,
          statusCode
        };
      } else {
        console.error(`❌ GestLine GET error (${statusCode}):`, responseData);
        return {
          success: false,
          error: `GET Error ${statusCode}: ${responseData}`,
          statusCode
        };
      }
    } catch (error) {
      console.error('❌ GestLine GET error:', error);
      return {
        success: false,
        error: `GET error: ${error instanceof Error ? error.message : String(error)}`,
        statusCode: 0
      };
    }
  }

  /**
   * Test della connessione API GestLine
   */
  async testConnection(): Promise<GestLineApiResponse> {
    try {
      console.log('🔄 Testing GestLine API connection...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'ping',
          timestamp: new Date().toISOString()
        }),
        rejectUnauthorized: false
      } as any);

      const statusCode = response.status;
      let responseData;

      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      if (response.ok) {
        console.log('✅ GestLine API connection successful');
        return {
          success: true,
          data: responseData,
          statusCode
        };
      } else {
        console.log(`⚠️ GestLine API responded with status ${statusCode}`);
        return {
          success: false,
          error: `Connection test failed: ${statusCode}`,
          statusCode
        };
      }
    } catch (error) {
      console.error('❌ GestLine API connection test failed:', error);
      return {
        success: false,
        error: `Connection test failed: ${error instanceof Error ? error.message : String(error)}`,
        statusCode: 0
      };
    }
  }
}

// Export singleton instance
export const gestlineService = new GestLineService();