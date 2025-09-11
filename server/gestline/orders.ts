import { Router } from "express";
import { gestlineService } from "../gestlineService";

const router = Router();

/**
 * GET/POST /orders -> Lista ordini da GestLine (SELECT XML)
 * Pattern wikenship.it: POST XML -> JSON response
 * Supporto sia GET che POST per backward compatibility
 */
router.get("/orders", async (_req, res) => {
  try {
    console.log("🔄 [WIKENSHIP-ORDERS] GET /orders - Lista ordini con SELECT XML");
    
    const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from ordini limit 20
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-ORDERS] Lista ordini recuperata successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-ORDERS] gestline_select_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_select_failed", 
      message: e.message,
      operation: "GET_ORDERS"
    });
  }
});

// POST alias per backward compatibility (stessa logica di GET)
router.post("/orders", async (req, res) => {
  // Se il body è vuoto, tratta come richiesta di lista (backward compatibility)
  if (!req.body || Object.keys(req.body).length === 0) {
    try {
      console.log("🔄 [WIKENSHIP-ORDERS] POST /orders (lista mode) - Lista ordini con SELECT XML");
      
      const xml = `
<GestLine>
  <Select>
    <IDRIferimento></IDRIferimento>
    <Select><![CDATA[
      select * from ordini limit 20
    ]]></Select>
    <NomiRekord></NomiRekord>
    <ValoreNull></ValoreNull>
  </Select>
</GestLine>`;

      const xmlResp = await gestlineService.postGestline(xml);
      const json = gestlineService.simpleXmlParse(xmlResp);
      
      console.log("✅ [WIKENSHIP-ORDERS] Lista ordini recuperata successfully");
      res.json(json);
    } catch (e: any) {
      console.error("❌ [WIKENSHIP-ORDERS] gestline_select_failed:", e.message);
      res.status(502).json({ 
        error: "gestline_select_failed", 
        message: e.message,
        operation: "GET_ORDERS"
      });
    }
    return;
  }
  
  // Se ha body, procedi con creazione ordine
  createOrderLogic(req, res);
});

/**
 * Logica creazione ordine estratta per riuso
 * Body: { codiceTerzo, riferimento, dataRif, dataConsegna, dataSped, idContatto, righe[] }
 */
async function createOrderLogic(req: any, res: any) {
  try {
    console.log("🔄 [WIKENSHIP-ORDERS] POST /orders - Crea ordine con NuovoOrdineCliente XML");
    const { codiceTerzo, riferimento, dataRif, dataConsegna, dataSped, idContatto, righe } = req.body;

    // Validazione dati essenziali
    if (!codiceTerzo) {
      return res.status(400).json({ 
        error: "validation_failed", 
        message: "codiceTerzo è obbligatorio" 
      });
    }

    // Costruzione righe XML
    const righeXml = (righe || []).map((r: any) => `
      <Riga>
        <CodiceArticolo>${r.codiceArticolo}</CodiceArticolo>
        <QNT>${r.qta}</QNT>
        ${r.prezzoNetto ? `<PrezzoNetto>${r.prezzoNetto}</PrezzoNetto>` : ``}
        ${r.note ? `<Note>${r.note}</Note>` : ``}
        ${r.sconto1 ? `<sconto1>${r.sconto1}</sconto1>` : ``}
      </Riga>
    `).join("");

    const xml = `
<GestLine>
  <NuovoOrdineCliente>
    <IDRIferimento>${Date.now()}</IDRIferimento>
    <UtenteCreatore>${process.env.GESTLINE_API_USERNAME || "api"}</UtenteCreatore>
    <testata>
      <CodiceTerzo>${codiceTerzo}</CodiceTerzo>
      <Riferimento>${riferimento || ""}</Riferimento>
      <DataRiferimento>${dataRif || ""}</DataRiferimento>
      <DataPrevistaConsegna>${dataConsegna || ""}</DataPrevistaConsegna>
      <DataPrevistaSpedizione>${dataSped || ""}</DataPrevistaSpedizione>
      <IDContatto>${idContatto || 0}</IDContatto>
      <ModelloStampa>ORDINECLIENTE_0</ModelloStampa>
      <IDDestinazione>0</IDDestinazione>
    </testata>
    <Dettaglio>
      ${righeXml}
    </Dettaglio>
  </NuovoOrdineCliente>
</GestLine>`;

    const xmlResp = await gestlineService.postGestline(xml);
    const json = gestlineService.simpleXmlParse(xmlResp);
    
    console.log("✅ [WIKENSHIP-ORDERS] Ordine creato successfully");
    res.json(json);
  } catch (e: any) {
    console.error("❌ [WIKENSHIP-ORDERS] gestline_create_order_failed:", e.message);
    res.status(502).json({ 
      error: "gestline_create_order_failed", 
      message: e.message,
      operation: "CREATE_ORDER"
    });
  }
}

export default router;