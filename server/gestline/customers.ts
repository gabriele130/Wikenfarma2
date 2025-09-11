import { Router } from "express";
import { gestlineService, GestLineService } from "../gestlineService";

const router = Router();

/**
 * GET/POST /customers -> Lista clienti da GestLine (SELECT XML)
 * Pattern wikenship.it: POST XML -> JSON response
 * Supporto sia GET che POST per backward compatibility
 */
router.get("/customers", async (_req, res) => {
  try {
    console.log("🔄 [WIKENSHIP-CUSTOMERS] GET /customers - Lista clienti con SELECT XML");
    
    const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from terzi where tipologia='CLIENTE' limit 100
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-CUSTOMERS] Lista clienti recuperata successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-CUSTOMERS] gestline_customers_select_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_customers_select_failed", 
      message: e.message,
      operation: "GET_CUSTOMERS"
    });
  }
});

// POST alias per backward compatibility
router.post("/customers", async (req, res) => {
  // Se body vuoto, tratta come richiesta lista (backward compatibility)
  if (!req.body || Object.keys(req.body).length === 0) {
    try {
      console.log("🔄 [WIKENSHIP-CUSTOMERS] POST /customers (lista mode) - Lista clienti con SELECT XML");
      
      const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from terzi where tipologia='CLIENTE' limit 100
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

      const xmlResp = await gestlineService.postGestline(xml);
      const json = gestlineService.simpleXmlParse(xmlResp);
      
      console.log("✅ [WIKENSHIP-CUSTOMERS] Lista clienti recuperata successfully");
      res.json(json);
    } catch (e: any) {
      console.error("❌ [WIKENSHIP-CUSTOMERS] gestline_customers_select_failed:", e.message);
      res.status(502).json({ 
        error: "gestline_customers_select_failed", 
        message: e.message,
        operation: "GET_CUSTOMERS"
      });
    }
    return;
  }
  
  // Se ha body, procedi con creazione cliente
  createCustomerLogic(req, res);
});

/**
 * Logica creazione cliente estratta per riuso
 * Body: { codice, ragioneSociale, partitaIva, codiceFiscale, indirizzo, ... }
 */
async function createCustomerLogic(req: any, res: any) {
  try {
    console.log("🔄 [WIKENSHIP-CUSTOMERS] POST /customers - Crea cliente con NuovoTerzo XML");
    const { 
      codice, 
      ragioneSociale, 
      partitaIva, 
      codiceFiscale, 
      indirizzo, 
      citta, 
      cap, 
      provincia,
      telefono,
      email
    } = req.body;

    // Validazione dati essenziali
    if (!codice || !ragioneSociale) {
      return res.status(400).json({ 
        error: "validation_failed", 
        message: "codice e ragioneSociale sono obbligatori" 
      });
    }

    const xml = `
<GestLine>
  <NuovoTerzo>
    <IDRIferimento>${Date.now()}</IDRIferimento>
    <UtenteCreatore>${GestLineService.xmlEscape(process.env.GESTLINE_API_USERNAME || "api")}</UtenteCreatore>
    <testata>
      <Codice>${GestLineService.xmlEscape(codice)}</Codice>
      <RagioneSociale>${GestLineService.xmlCData(ragioneSociale)}</RagioneSociale>
      ${partitaIva ? `<PartitaIva>${GestLineService.xmlEscape(partitaIva)}</PartitaIva>` : ''}
      ${codiceFiscale ? `<CodiceFiscale>${GestLineService.xmlEscape(codiceFiscale)}</CodiceFiscale>` : ''}
      ${indirizzo ? `<Indirizzo>${GestLineService.xmlCData(indirizzo)}</Indirizzo>` : ''}
      ${citta ? `<Citta>${GestLineService.xmlEscape(citta)}</Citta>` : ''}
      ${cap ? `<CAP>${GestLineService.xmlEscape(cap)}</CAP>` : ''}
      ${provincia ? `<Provincia>${GestLineService.xmlEscape(provincia)}</Provincia>` : ''}
      ${telefono ? `<Telefono>${GestLineService.xmlEscape(telefono)}</Telefono>` : ''}
      ${email ? `<Email>${GestLineService.xmlEscape(email)}</Email>` : ''}
      <TipoTerzo>CLIENTE</TipoTerzo>
      <Attivo>1</Attivo>
      <DataInserimento>${new Date().toISOString().split('T')[0]}</DataInserimento>
    </testata>
  </NuovoTerzo>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-CUSTOMERS] Cliente creato successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-CUSTOMERS] gestline_create_customer_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_create_customer_failed", 
      message: e.message,
      operation: "CREATE_CUSTOMER"
    });
  }
}

export default router;