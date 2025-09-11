import { Router } from "express";
import { gestlineService } from "../gestlineService";

const router = Router();

/**
 * POST /test -> Test connessione GestLine (legacy endpoint)
 */
router.post("/test", async (_req, res) => {
  try {
    console.log("🔄 [WIKENSHIP-LEGACY] POST /test - Testing GestLine API connection using POST + XML...");
    const result = await gestlineService.testConnection();
    res.json(result);
  } catch (error: any) {
    console.error("❌ [WIKENSHIP-LEGACY] Failed to test GestLine connection:", error);
    res.status(500).json({ 
      error: "gestline_test_failed",
      message: error.message || "Failed to test GestLine connection" 
    });
  }
});

/**
 * POST /send-order -> Invia ordine singolo (legacy endpoint)
 * Body: GestLineOrderData con orderNumber, items, etc.
 */
router.post("/send-order", async (req, res) => {
  try {
    const orderData = req.body;
    console.log(`🔄 [WIKENSHIP-LEGACY] Sending order ${orderData.orderNumber} to GestLine...`);
    
    const result = await gestlineService.sendOrder(orderData);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Order ${orderData.orderNumber} sent to GestLine successfully`,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
        statusCode: result.statusCode
      });
    }
  } catch (error: any) {
    console.error("❌ [WIKENSHIP-LEGACY] Failed to send order to GestLine:", error);
    res.status(500).json({ 
      error: "gestline_send_order_failed",
      message: error.message || "Failed to send order to GestLine" 
    });
  }
});

/**
 * POST /sync-product -> Sincronizza prodotto singolo (legacy endpoint)
 * Body: { code, description, price, ... }
 */
router.post("/sync-product", async (req, res) => {
  try {
    const productData = req.body;
    console.log(`🔄 [WIKENSHIP-LEGACY] Syncing product ${productData.code} to GestLine...`);
    
    const result = await gestlineService.syncProduct(productData);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Product ${productData.code} synced to GestLine successfully`,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
        statusCode: result.statusCode
      });
    }
  } catch (error: any) {
    console.error("❌ [WIKENSHIP-LEGACY] Failed to sync product to GestLine:", error);
    res.status(500).json({ 
      error: "gestline_sync_product_failed",
      message: error.message || "Failed to sync product to GestLine" 
    });
  }
});

/**
 * POST /sync-customer -> Sincronizza cliente singolo (legacy endpoint)
 * Body: { code, name, email, ... }
 */
router.post("/sync-customer", async (req, res) => {
  try {
    const customerData = req.body;
    console.log(`🔄 [WIKENSHIP-LEGACY] Syncing customer ${customerData.code || customerData.id} to GestLine using <NuovoTerzo>...`);
    
    const result = await gestlineService.syncCustomer(customerData);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Customer ${customerData.code || customerData.id} synced to GestLine successfully`,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
        statusCode: result.statusCode
      });
    }
  } catch (error: any) {
    console.error("❌ [WIKENSHIP-LEGACY] Failed to sync customer to GestLine:", error);
    res.status(500).json({ 
      error: "gestline_sync_customer_failed",
      message: error.message || "Failed to sync customer to GestLine" 
    });
  }
});

/**
 * POST /batch-orders -> Invia batch multipli di ordini (legacy endpoint)
 * Body: { orders: GestLineOrderData[] }
 */
router.post("/batch-orders", async (req, res) => {
  try {
    const { orders } = req.body as { orders: any[] };
    console.log(`🔄 [WIKENSHIP-LEGACY] Sending ${orders.length} orders to GestLine...`);
    
    const results = [];
    for (const orderData of orders) {
      const result = await gestlineService.sendOrder(orderData);
      results.push({
        orderNumber: orderData.orderNumber,
        success: result.success,
        error: result.error,
        statusCode: result.statusCode
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `Processed ${orders.length} orders. ${successCount} successful.`,
      results
    });
  } catch (error: any) {
    console.error("❌ [WIKENSHIP-LEGACY] Failed to send batch orders to GestLine:", error);
    res.status(500).json({ 
      error: "gestline_batch_orders_failed",
      message: error.message || "Failed to send batch orders to GestLine" 
    });
  }
});

export default router;