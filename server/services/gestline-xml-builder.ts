/**
 * GestLine XML Builder Service
 * Eliminates XML construction duplication across GestLine modules
 */

import { GestLineService } from './gestline.service';

export class GestLineXmlBuilder {
  /**
   * XML escape utility - centralized
   */
  static xmlEscape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * XML CDATA wrapper - centralized
   */
  static xmlCData(value: string): string {
    return `<![CDATA[${value}]]>`;
  }

  /**
   * Generic Select query builder for GestLine
   */
  static buildSelectQuery(table: string, filters?: Record<string, any>, limit?: number): string {
    let query = `SELECT * FROM ${table}`;
    
    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key} = '${this.xmlEscape(String(value))}'`)
        .join(' AND ');
      
      if (conditions) {
        query += ` WHERE ${conditions}`;
      }
    }
    
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    return query;
  }

  /**
   * Standard GestLine envelope wrapper
   */
  static buildEnvelope(query: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ges="http://gestline.com/webservices">
  <soap:Header/>
  <soap:Body>
    <ges:ExecuteQuery>
      <ges:query>${this.xmlCData(query)}</ges:query>
    </ges:ExecuteQuery>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Customer creation XML
   */
  static buildNuovoTerzo(customerData: {
    codice: string;
    ragioneSociale: string;
    indirizzo?: string;
    cap?: string;
    citta?: string;
    provincia?: string;
    partitaIva?: string;
    codiceFiscale?: string;
    telefono?: string;
    email?: string;
  }): string {
    const terzoXml = `
      <terzo>
        <codice>${this.xmlEscape(customerData.codice)}</codice>
        <ragioneSociale>${this.xmlEscape(customerData.ragioneSociale)}</ragioneSociale>
        ${customerData.indirizzo ? `<indirizzo>${this.xmlEscape(customerData.indirizzo)}</indirizzo>` : ''}
        ${customerData.cap ? `<cap>${this.xmlEscape(customerData.cap)}</cap>` : ''}
        ${customerData.citta ? `<citta>${this.xmlEscape(customerData.citta)}</citta>` : ''}
        ${customerData.provincia ? `<provincia>${this.xmlEscape(customerData.provincia)}</provincia>` : ''}
        ${customerData.partitaIva ? `<partitaIva>${this.xmlEscape(customerData.partitaIva)}</partitaIva>` : ''}
        ${customerData.codiceFiscale ? `<codiceFiscale>${this.xmlEscape(customerData.codiceFiscale)}</codiceFiscale>` : ''}
        ${customerData.telefono ? `<telefono>${this.xmlEscape(customerData.telefono)}</telefono>` : ''}
        ${customerData.email ? `<email>${this.xmlEscape(customerData.email)}</email>` : ''}
      </terzo>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ges="http://gestline.com/webservices">
  <soap:Header/>
  <soap:Body>
    <ges:NuovoTerzo>
      ${terzoXml}
    </ges:NuovoTerzo>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Product creation XML
   */
  static buildNuovoArticolo(productData: {
    codice: string;
    descrizione: string;
    prezzoVendita?: number;
    prezzoAcquisto?: number;
    categoria?: string;
    sottocategoria?: string;
    unitaMisura?: string;
    note?: string;
  }): string {
    const articoloXml = `
      <articolo>
        <codice>${this.xmlEscape(productData.codice)}</codice>
        <descrizione>${this.xmlEscape(productData.descrizione)}</descrizione>
        ${productData.prezzoVendita ? `<prezzoVendita>${productData.prezzoVendita}</prezzoVendita>` : ''}
        ${productData.prezzoAcquisto ? `<prezzoAcquisto>${productData.prezzoAcquisto}</prezzoAcquisto>` : ''}
        ${productData.categoria ? `<categoria>${this.xmlEscape(productData.categoria)}</categoria>` : ''}
        ${productData.sottocategoria ? `<sottocategoria>${this.xmlEscape(productData.sottocategoria)}</sottocategoria>` : ''}
        ${productData.unitaMisura ? `<unitaMisura>${this.xmlEscape(productData.unitaMisura)}</unitaMisura>` : ''}
        ${productData.note ? `<note>${this.xmlEscape(productData.note)}</note>` : ''}
      </articolo>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ges="http://gestline.com/webservices">
  <soap:Header/>
  <soap:Body>
    <ges:NuovoArticolo>
      ${articoloXml}
    </ges:NuovoArticolo>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Order creation XML
   */
  static buildNuovoOrdineCliente(orderData: {
    numeroOrdine: string;
    codiceCliente: string;
    dataOrdine: string;
    totale?: number;
    note?: string;
    righe: Array<{
      codiceArticolo: string;
      quantita: number;
      prezzoUnitario?: number;
      descrizione?: string;
    }>;
  }): string {
    const righeXml = orderData.righe.map(riga => `
      <riga>
        <codiceArticolo>${this.xmlEscape(riga.codiceArticolo)}</codiceArticolo>
        <quantita>${riga.quantita}</quantita>
        ${riga.prezzoUnitario ? `<prezzoUnitario>${riga.prezzoUnitario}</prezzoUnitario>` : ''}
        ${riga.descrizione ? `<descrizione>${this.xmlEscape(riga.descrizione)}</descrizione>` : ''}
      </riga>`).join('');

    const ordineXml = `
      <ordine>
        <numeroOrdine>${this.xmlEscape(orderData.numeroOrdine)}</numeroOrdine>
        <codiceCliente>${this.xmlEscape(orderData.codiceCliente)}</codiceCliente>
        <dataOrdine>${this.xmlEscape(orderData.dataOrdine)}</dataOrdine>
        ${orderData.totale ? `<totale>${orderData.totale}</totale>` : ''}
        ${orderData.note ? `<note>${this.xmlEscape(orderData.note)}</note>` : ''}
        <righe>
          ${righeXml}
        </righe>
      </ordine>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ges="http://gestline.com/webservices">
  <soap:Header/>
  <soap:Body>
    <ges:NuovoOrdineCliente>
      ${ordineXml}
    </ges:NuovoOrdineCliente>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Generic list/create handler for GestLine endpoints
   * Eliminates GET/POST dual-mode duplication
   */
  static async listOrCreate<T>(
    req: any,
    res: any,
    listFunction: () => Promise<T[]>,
    createFunction: (data: any) => Promise<T>
  ): Promise<void> {
    try {
      if (req.method === 'GET') {
        const items = await listFunction();
        res.json(items);
      } else if (req.method === 'POST') {
        const newItem = await createFunction(req.body);
        res.status(201).json(newItem);
      } else {
        res.status(405).json({ message: 'Method not allowed' });
      }
    } catch (error: any) {
      console.error('GestLine operation error:', error);
      
      if (error.message?.includes('GestLine') || error.message?.includes('XML')) {
        res.status(502).json({ 
          message: 'External service error',
          error: 'gestline_error',
          details: error.message 
        });
      } else {
        res.status(500).json({ 
          message: 'Internal server error',
          error: 'server_error'
        });
      }
    }
  }
}