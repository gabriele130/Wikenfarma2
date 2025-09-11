import { Router } from "express";
import { gestlineService } from "../gestlineService";

const router = Router();

/**
 * GET /customers -> Lista clienti da GestLine (SELECT XML)
 * Pattern wikenship.it: POST XML -> JSON response
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

/**
 * POST /customers -> Crea nuovo cliente in GestLine (NuovoTerzo XML)
 * Body: { codice, ragioneSociale, partitaIva, codiceFiscale, indirizzo, ... }
 */
router.post("/customers", async (req, res) => {
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
    <UtenteCreatore>${process.env.GESTLINE_API_USERNAME || "api"}</UtenteCreatore>
    <testata>
      <Codice>${codice}</Codice>
      <RagioneSociale>${ragioneSociale}</RagioneSociale>
      ${partitaIva ? `<PartitaIva>${partitaIva}</PartitaIva>` : ''}
      ${codiceFiscale ? `<CodiceFiscale>${codiceFiscale}</CodiceFiscale>` : ''}
      ${indirizzo ? `<Indirizzo>${indirizzo}</Indirizzo>` : ''}
      ${citta ? `<Citta>${citta}</Citta>` : ''}
      ${cap ? `<CAP>${cap}</CAP>` : ''}
      ${provincia ? `<Provincia>${provincia}</Provincia>` : ''}
      ${telefono ? `<Telefono>${telefono}</Telefono>` : ''}
      ${email ? `<Email>${email}</Email>` : ''}
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
});

export default router;