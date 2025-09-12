// GestLine API Service - Integrazione con sistema ERP GestLine
// PATTERN CORRETTO: Solo POST con XML payload <GestLine>...</GestLine> 
// Endpoint: /api_gestline - Basic Auth - Risposta XML → convertita JSON

// Usando parser XML nativo di Node.js invece di dipendenze esterne

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
   * Converte XML in JSON object per il frontend usando parser nativo
   */
  private xmlToJson(xmlString: string): any {
    try {
      // Parser XML semplificato per gestire risposte GestLine
      // Production-safe logging without PII
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 [GESTLINE] XML to parse:', xmlString.substring(0, 200) + '...');
      }
      
      // Semplice estrazione di dati XML con regex per i casi più comuni
      const result: any = { rawXml: xmlString };
      
      // Estrai errori se presenti (compatibile ES5)
      const errorMatch = xmlString.match(/<[Ee]rror[^>]*>([\s\S]*?)<\/[Ee]rror>/);
      if (errorMatch) {
        result.error = errorMatch[1].trim();
      }
      
      // Estrai successo/status (compatibile ES5)
      const successMatch = xmlString.match(/<[Ss]uccess[^>]*>([\s\S]*?)<\/[Ss]uccess>/) || 
                           xmlString.match(/<[Ss]tatus[^>]*>([\s\S]*?)<\/[Ss]tatus>/);
      if (successMatch) {
        result.status = successMatch[1].trim();
      }
      
      // Estrai dati principali se presenti (compatibile ES5)
      const dataMatch = xmlString.match(/<[Dd]ata[^>]*>([\s\S]*?)<\/[Dd]ata>/);
      if (dataMatch) {
        result.data = dataMatch[1].trim();
      }
      
      return result;
    } catch (error) {
      console.error('❌ [GESTLINE] XML parsing error:', error);
      return { rawXml: xmlString, parseError: true };
    }
  }


  /**
   * POST XML -> XML text (seguendo pattern wikenship.it)
   * Implementazione sicura con certificato SSL Let's Encrypt
   * wikenship.it certificate: expires 17 November 2025
   */
  async postGestline(xmlBody: string): Promise<string> {
    const https = await import('https');
    
    // Configurazione SSL ottimizzata per wikenship.it con Let's Encrypt
    const tlsInsecure = process.env.GESTLINE_TLS_INSECURE === 'true';
    const agent = new https.Agent({ 
      rejectUnauthorized: !tlsInsecure,
      // SSL/TLS configuration for Let's Encrypt certificate
      secureProtocol: 'TLSv1_2_method',
      ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256'
    });
    
    if (tlsInsecure && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ [GESTLINE] TLS insecure mode enabled in production - security risk!');
    }
    
    console.log(`🔐 [GESTLINE] POST to ${this.apiUrl} with SSL certificate support`);
    
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Accept": "application/xml",
        "Authorization": this.authHeader,
        "User-Agent": "WikenFarma/1.0 (wikenship.it)",
      },
      // @ts-ignore (node >=18 ha fetch; usiamo agent per TLS)
      agent,
      body: xmlBody.trim(),
    });
    
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`GestLine ${response.status}: ${text.slice(0,200)}`);
    }
    return text;
  }

  /**
   * POST XML -> JSON wrapper che converte la risposta XML in GestLineApiResponse
   * Usato dai metodi che richiedono una risposta strutturata
   */
  private async postXmlToGestLine(xmlPayload: string, operation: string): Promise<GestLineApiResponse> {
    try {
      const xmlResponse = await this.postGestline(xmlPayload);
      const parsedResponse = this.xmlToJson(xmlResponse);
      
      // Determina se l'operazione è riuscita
      const success = !parsedResponse.error && !parsedResponse.parseError;
      
      return {
        success,
        data: parsedResponse.data || parsedResponse,
        error: parsedResponse.error || (parsedResponse.parseError ? 'XML parsing failed' : undefined),
        statusCode: success ? 200 : 400
      };
    } catch (error) {
      console.error(`❌ [GESTLINE] ${operation} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500
      };
    }
  }

  /**
   * XML Escaping per prevenire XML injection vulnerability
   * Critico per sicurezza: mai interpolare valori utente direttamente in XML
   */
  static xmlEscape(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * CDATA wrapper per valori XML contenenti caratteri speciali
   */
  static xmlCData(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    // Escaping di ]]> all'interno di CDATA per evitare breaking
    const escaped = String(value).replace(/\]\]>/g, ']]&gt;');
    return `<![CDATA[${escaped}]]>`;
  }

  /**
   * Parsing XML semplice (senza xml2js per evitare package.json issues)
   */
  simpleXmlParse(xmlString: string): any {
    // Parser XML basico per oggetti GestLine
    const result: any = { rawXml: xmlString };
    
    try {
      // Estrai campi principali
      const statusMatch = xmlString.match(/<[Ss]tatus[^>]*>(.*?)<\/[Ss]tatus>/);
      if (statusMatch) result.status = statusMatch[1];
      
      const errorMatch = xmlString.match(/<[Ee]rror[^>]*>(.*?)<\/[Ee]rror>/);
      if (errorMatch) result.error = errorMatch[1];
      
      const dataMatch = xmlString.match(/<[Dd]ata[^>]*>(.*?)<\/[Dd]ata>/);
      if (dataMatch) result.data = dataMatch[1];
      
      // Se è una risposta di successo ma senza struttura specifica, 
      // considera tutto il contenuto come data
      if (!result.error && !result.data && xmlString.length > 0) {
        result.success = true;
        result.data = xmlString;
      }
      
      return result;
    } catch (e) {
      return { rawXml: xmlString, parseError: true };
    }
  }

  /**
   * Invia un ordine a GestLine usando XML <NuovoOrdineCliente>
   * SICUREZZA: Tutti i valori sono protetti da XML injection con xmlEscape/xmlCData
   */
  async sendOrder(orderData: GestLineOrderData): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <NuovoOrdineCliente>
          <NumeroOrdine>${GestLineService.xmlEscape(orderData.orderNumber)}</NumeroOrdine>
          <Cliente>
            <Nome>${GestLineService.xmlCData(orderData.customerData.name)}</Nome>
            <Email>${GestLineService.xmlEscape(orderData.customerData.email || '')}</Email>
            <Telefono>${GestLineService.xmlEscape(orderData.customerData.phone || '')}</Telefono>
            <Indirizzo>${GestLineService.xmlCData(orderData.customerData.address || '')}</Indirizzo>
          </Cliente>
          <Righe>
            ${orderData.items.map(item => `
              <Riga>
                <CodiceArticolo>${GestLineService.xmlEscape(item.productCode)}</CodiceArticolo>
                <Quantita>${GestLineService.xmlEscape(item.quantity)}</Quantita>
                <PrezzoUnitario>${GestLineService.xmlEscape(item.unitPrice)}</PrezzoUnitario>
              </Riga>
            `).join('')}
          </Righe>
          <Totale>${GestLineService.xmlEscape(orderData.total)}</Totale>
          <Note>${GestLineService.xmlCData(orderData.notes || '')}</Note>
        </NuovoOrdineCliente>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, `SendOrder(${orderData.orderNumber})`);
  }

  /**
   * Sincronizza un prodotto con GestLine usando XML
   * SICUREZZA: Tutti i valori sono protetti da XML injection con xmlEscape/xmlCData
   */
  async syncProduct(productData: any): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <NuovoArticolo>
          <Codice>${GestLineService.xmlEscape(productData.code)}</Codice>
          <Nome>${GestLineService.xmlCData(productData.name)}</Nome>
          <Descrizione>${GestLineService.xmlCData(productData.description || '')}</Descrizione>
          <PrezzoVendita>${GestLineService.xmlEscape(productData.price)}</PrezzoVendita>
          <Categoria>${GestLineService.xmlEscape(productData.category || '')}</Categoria>
          <GiacenzaMinima>${GestLineService.xmlEscape(productData.minStock || 0)}</GiacenzaMinima>
          <Attivo>${GestLineService.xmlEscape(productData.isActive ? 'true' : 'false')}</Attivo>
        </NuovoArticolo>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, `SyncProduct(${productData.code})`);
  }

  /**
   * Crea/Aggiorna un terzo (cliente/fornitore) su GestLine usando XML <NuovoTerzo>
   * SICUREZZA: Tutti i valori sono protetti da XML injection con xmlEscape/xmlCData
   */
  async syncCustomer(customerData: any): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <NuovoTerzo>
          <Codice>${GestLineService.xmlEscape(customerData.code || customerData.id)}</Codice>
          <RagioneSociale>${GestLineService.xmlCData(customerData.name)}</RagioneSociale>
          <Nome>${GestLineService.xmlEscape(customerData.firstName || '')}</Nome>
          <Cognome>${GestLineService.xmlEscape(customerData.lastName || '')}</Cognome>
          <Email>${GestLineService.xmlEscape(customerData.email || '')}</Email>
          <Telefono>${GestLineService.xmlEscape(customerData.phone || '')}</Telefono>
          <Indirizzo>${GestLineService.xmlCData(customerData.address || '')}</Indirizzo>
          <Citta>${GestLineService.xmlEscape(customerData.city || '')}</Citta>
          <CAP>${GestLineService.xmlEscape(customerData.zipCode || '')}</CAP>
          <CodiceFiscale>${GestLineService.xmlEscape(customerData.fiscalCode || '')}</CodiceFiscale>
          <PartitaIVA>${GestLineService.xmlEscape(customerData.vatNumber || '')}</PartitaIVA>
          <Tipo>${GestLineService.xmlEscape(customerData.type === 'pharmacy' ? 'Farmacia' : 'Cliente')}</Tipo>
          <Attivo>${GestLineService.xmlEscape(customerData.isActive ? 'true' : 'false')}</Attivo>
        </NuovoTerzo>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, `SyncCustomer(${customerData.code || customerData.id})`);
  }

  /**
   * Recupera ordini da GestLine usando XML <Select>
   */
  async getOrders(): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <Select>
          <Tabella>Ordini</Tabella>
          <Campi>*</Campi>
          <Filtri>
            <Filtro>
              <Campo>DataOrdine</Campo>
              <Operatore>>=</Operatore>
              <Valore>${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</Valore>
            </Filtro>
          </Filtri>
          <Ordinamento>DataOrdine DESC</Ordinamento>
          <Limite>100</Limite>
        </Select>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, 'GetOrders');
  }

  /**
   * Recupera prodotti da GestLine usando XML <Select>
   */
  async getProducts(): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <Select>
          <Tabella>Articoli</Tabella>
          <Campi>*</Campi>
          <Filtri>
            <Filtro>
              <Campo>Attivo</Campo>
              <Operatore>=</Operatore>
              <Valore>true</Valore>
            </Filtro>
          </Filtri>
          <Ordinamento>Nome ASC</Ordinamento>
          <Limite>500</Limite>
        </Select>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, 'GetProducts');
  }

  /**
   * Recupera clienti da GestLine usando XML <Select>
   */
  async getCustomers(): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <Select>
          <Tabella>Clienti</Tabella>
          <Campi>*</Campi>
          <Filtri>
            <Filtro>
              <Campo>Attivo</Campo>
              <Operatore>=</Operatore>
              <Valore>true</Valore>
            </Filtro>
          </Filtri>
          <Ordinamento>Nome ASC</Ordinamento>
          <Limite>1000</Limite>
        </Select>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, 'GetCustomers');
  }

  /**
   * Metodo generico getData sostituito da metodi specifici
   */
  async getData(endpoint: string = ''): Promise<GestLineApiResponse> {
    console.log(`⚠️ [GESTLINE] getData(${endpoint}) is deprecated, use specific methods`);
    
    switch (endpoint) {
      case 'orders':
        return this.getOrders();
      case 'products':
        return this.getProducts();
      case 'customers':
        return this.getCustomers();
      default:
        return {
          success: false,
          error: `Endpoint '${endpoint}' not supported. Use getOrders(), getProducts(), or getCustomers()`,
          statusCode: 400
        };
    }
  }

  /**
   * Test della connessione API GestLine usando XML semplice
   */
  async testConnection(): Promise<GestLineApiResponse> {
    const xmlPayload = `
      <GestLine>
        <Test>
          <Timestamp>${new Date().toISOString()}</Timestamp>
          <Client>WikenFarma</Client>
        </Test>
      </GestLine>
    `;

    return this.postXmlToGestLine(xmlPayload, 'TestConnection');
  }
}

// Export singleton instance
export const gestlineService = new GestLineService();