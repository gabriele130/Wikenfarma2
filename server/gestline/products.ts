import { Router } from "express";
import { gestlineService, GestLineService } from "../services/gestline.service";

const router = Router();

/**
 * GET/POST /products -> Lista prodotti da GestLine (SELECT XML)
 * Pattern wikenship.it: POST XML -> JSON response  
 * Supporto sia GET che POST per backward compatibility
 */
router.get("/products", async (_req, res) => {
  try {
    console.log("🔄 [WIKENSHIP-PRODUCTS] GET /products - Lista prodotti con SELECT XML");
    
    const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from articoli limit 50
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-PRODUCTS] Lista prodotti recuperata successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-PRODUCTS] gestline_products_select_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_products_select_failed", 
      message: e.message,
      operation: "GET_PRODUCTS"
    });
  }
});

// POST alias per backward compatibility
router.post("/products", async (req, res) => {
  // Se body vuoto, tratta come richiesta lista (backward compatibility)
  if (!req.body || Object.keys(req.body).length === 0) {
    try {
      console.log("🔄 [WIKENSHIP-PRODUCTS] POST /products (lista mode) - Lista prodotti con SELECT XML");
      
      const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from articoli limit 50
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

      const xmlResp = await gestlineService.postGestline(xml);
      const json = gestlineService.simpleXmlParse(xmlResp);
      
      console.log("✅ [WIKENSHIP-PRODUCTS] Lista prodotti recuperata successfully");
      res.json(json);
    } catch (e: any) {
      console.error("❌ [WIKENSHIP-PRODUCTS] gestline_products_select_failed:", e.message);
      res.status(502).json({ 
        error: "gestline_products_select_failed", 
        message: e.message,
        operation: "GET_PRODUCTS"
      });
    }
    return;
  }
  
  // Se ha body, procedi con creazione prodotto
  createProductLogic(req, res);
});

/**
 * Logica creazione prodotto estratta per riuso
 * Body: { codice, descrizione, prezzoVendita, categoria, ... }
 */
async function createProductLogic(req: any, res: any) {
  try {
    console.log("🔄 [WIKENSHIP-PRODUCTS] POST /products - Crea prodotto con NuovoArticolo XML");
    const { codice, descrizione, prezzoVendita, categoria, um = "PZ", attivo = true } = req.body;

    // Validazione dati essenziali
    if (!codice || !descrizione) {
      return res.status(400).json({ 
        error: "validation_failed", 
        message: "codice e descrizione sono obbligatori" 
      });
    }

    const xml = `
<GestLine>
  <NuovoArticolo>
    <IDRIferimento>${Date.now()}</IDRIferimento>
    <UtenteCreatore>${GestLineService.xmlEscape(process.env.GESTLINE_API_USERNAME || "api")}</UtenteCreatore>
    <testata>
      <Codice>${GestLineService.xmlEscape(codice)}</Codice>
      <Descrizione>${GestLineService.xmlCData(descrizione)}</Descrizione>
      ${prezzoVendita ? `<PrezzoVendita>${GestLineService.xmlEscape(prezzoVendita)}</PrezzoVendita>` : ''}
      ${categoria ? `<Categoria>${GestLineService.xmlEscape(categoria)}</Categoria>` : ''}
      <UnitaMisura>${GestLineService.xmlEscape(um)}</UnitaMisura>
      <Attivo>${attivo ? 1 : 0}</Attivo>
      <TipoArticolo>NORMALE</TipoArticolo>
      <DataInserimento>${new Date().toISOString().split('T')[0]}</DataInserimento>
    </testata>
  </NuovoArticolo>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-PRODUCTS] Prodotto creato successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-PRODUCTS] gestline_create_product_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_create_product_failed", 
      message: e.message,
      operation: "CREATE_PRODUCT"
    });
  }
}

export default router;