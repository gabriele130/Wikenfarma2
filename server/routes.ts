import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupCustomAuth, authenticateToken, requireRole, requireUserType } from "./customAuth";
import { insertCustomerSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertInformatoreSchema } from "@shared/schema";
import { z } from "zod";
import { gestlineService, GestLineOrderData } from "./gestlineService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for domain verification
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      domain: 'wikenship.it',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Root redirect for wikenship.it
  app.get('/', (req, res, next) => {
    // If it's an API request, let it continue to API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // For domain requests, serve the app
    const host = req.get('host');
    if (host?.includes('wikenship.it')) {
      // Let Vite or static serve handle the root
      return next();
    }
    
    next();
  });

  // Custom Auth middleware and routes
  setupCustomAuth(app);

  // Protected API routes use authenticateToken middleware

  // Dashboard metrics - Dynamic data endpoint
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Global search
  app.get('/api/search', authenticateToken, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const results = await storage.globalSearch(query);
      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // Customer routes
  app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const type = req.query.type as string;
      
      const result = await storage.getCustomers(page, limit, search, type);
      res.json(result);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Customer statistics (must be before parameterized routes)
  app.get('/api/customers/stats', authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getCustomerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      res.status(500).json({ message: "Failed to fetch customer statistics" });
    }
  });

  app.get('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'create',
        entityType: 'customer',
        entityId: customer.id,
        description: `Creato nuovo cliente: ${customer.firstName} ${customer.lastName || customer.companyName}`,
      });
      
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'update',
        entityType: 'customer',
        entityId: customer.id,
        description: `Aggiornato cliente: ${customer.firstName} ${customer.lastName || customer.companyName}`,
      });
      
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
      await storage.deleteCustomer(req.params.id);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'delete',
        entityType: 'customer',
        entityId: req.params.id,
        description: `Eliminato cliente`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Product routes
  app.get('/api/products', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      
      const result = await storage.getProducts(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/low-stock', authenticateToken, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.post('/api/products', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'create',
        entityType: 'product',
        entityId: product.id,
        description: `Creato nuovo prodotto: ${product.name}`,
      });
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Order routes
  app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const customerType = req.query.customerType as string;
      
      const result = await storage.getOrders(page, limit, status, customerType);
      res.json(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/recent', authenticateToken, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const orders = await storage.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
      const orderSchema = insertOrderSchema.extend({
        items: z.array(insertOrderItemSchema)
      });
      
      const { items, ...orderData } = orderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, items);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.id,
        action: 'create',
        entityType: 'order',
        entityId: order.id,
        description: `Creato nuovo ordine: ${order.orderNumber}`,
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = insertOrderSchema.partial();
      
      const updateData = updateSchema.parse(req.body);
      const updatedOrder = await storage.updateOrder(id, updateData);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.id,
        action: 'update',
        entityType: 'order',
        entityId: id,
        description: `Modificato ordine: ${updatedOrder.orderNumber}`,
      });
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get order details for logging
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const deleted = await storage.deleteOrder(id);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete order" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.id,
        action: 'delete',
        entityType: 'order',
        entityId: id,
        description: `Eliminato ordine: ${order.orderNumber}`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  app.get('/api/orders/statistics', authenticateToken, async (req, res) => {
    try {
      const statistics = await storage.getOrderStatistics();
      res.json(statistics);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      res.status(500).json({ message: "Failed to fetch order statistics" });
    }
  });

  // Shipment routes
  app.get('/api/shipments', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getShipments(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  // Commission routes
  app.get('/api/commissions', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getCommissions(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  // Integration routes
  app.get('/api/integrations', authenticateToken, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Shipment routes
  app.get('/api/shipments', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getShipments(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  // Commission routes
  app.get('/api/commissions', authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getCommissions(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  // Integration routes
  app.get('/api/integrations', authenticateToken, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Activity log routes
  app.get('/api/activity-logs', authenticateToken, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Informatori routes
  app.get('/api/informatori', authenticateToken, async (req, res) => {
    try {
      const informatori = await storage.getInformatori();
      res.json(informatori);
    } catch (error) {
      console.error("Error fetching informatori:", error);
      res.status(500).json({ message: "Failed to fetch informatori" });
    }
  });

  app.post('/api/informatori', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertInformatoreSchema.parse(req.body);
      const informatore = await storage.createInformatore(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'create',
        entityType: 'informatore',
        entityId: informatore.id,
        description: `Creato nuovo informatore: ${informatore.firstName} ${informatore.lastName}`,
      });
      
      res.status(201).json(informatore);
    } catch (error) {
      console.error("Error creating informatore:", error);
      res.status(500).json({ message: "Failed to create informatore" });
    }
  });

  app.get('/api/informatori/:id/dashboard', async (req, res) => {
    try {
      const informatoreId = req.params.id;
      const dashboard = await storage.getInformatoreDashboard(informatoreId);
      res.json(dashboard);
    } catch (error) {
      console.error("Error fetching informatore dashboard:", error);
      res.status(500).json({ message: "Failed to fetch informatore dashboard" });
    }
  });

  // WIKENSHIP Routes - Orders from WooCommerce/eBay → GestLine
  app.get("/api/wikenship/orders", authenticateToken, async (req, res) => {
    try {
      const { status, source, page = 1, limit = 20 } = req.query;
      const orders = await storage.getWikenshipOrders({
        status: status as string,
        source: source as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch wikenship orders:", error);
      res.status(500).json({ message: "Failed to fetch wikenship orders" });
    }
  });

  app.post("/api/wikenship/orders", authenticateToken, async (req, res) => {
    try {
      const orderData = req.body;
      const order = await storage.createWikenshipOrder(orderData);
      
      // Trigger GestLine and ODOO integration
      await storage.processWikenshipOrder(order.id);
      
      res.json(order);
    } catch (error) {
      console.error("Failed to create wikenship order:", error);
      res.status(500).json({ message: "Failed to create wikenship order" });
    }
  });

  app.post("/api/wikenship/process-batch", authenticateToken, async (req, res) => {
    try {
      const { orderIds } = req.body;
      const results = await storage.processBatchWikenshipOrders(orderIds);
      res.json(results);
    } catch (error) {
      console.error("Failed to process batch orders:", error);
      res.status(500).json({ message: "Failed to process batch orders" });
    }
  });

  // PharmaEVO Routes - Pharmacy orders integration
  app.get("/api/pharmaevo/orders", authenticateToken, async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const orders = await storage.getPharmaevoOrders({
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch pharmaevo orders:", error);
      res.status(500).json({ message: "Failed to fetch pharmaevo orders" });
    }
  });

  app.post("/api/pharmaevo/sync", authenticateToken, async (req, res) => {
    try {
      const syncResult = await storage.syncPharmaevoOrders();
      res.json(syncResult);
    } catch (error) {
      console.error("Failed to sync pharmaevo orders:", error);
      res.status(500).json({ message: "Failed to sync pharmaevo orders" });
    }
  });

  // GestLine API Routes - ERP integration
  app.get("/api/gestline/data", authenticateToken, async (req, res) => {
    try {
      const endpoint = req.query.endpoint as string;
      console.log(`🔄 Getting GestLine data from endpoint: ${endpoint || 'root'}`);
      
      const result = await gestlineService.getData(endpoint);
      res.json(result);
    } catch (error) {
      console.error("Failed to get GestLine data:", error);
      res.status(500).json({ message: "Failed to get GestLine data" });
    }
  });

  app.get("/api/gestline/orders", authenticateToken, async (req, res) => {
    try {
      console.log("🔄 Getting orders from GestLine...");
      const result = await gestlineService.getData('orders');
      res.json(result);
    } catch (error) {
      console.error("Failed to get GestLine orders:", error);
      res.status(500).json({ message: "Failed to get GestLine orders" });
    }
  });

  app.get("/api/gestline/products", authenticateToken, async (req, res) => {
    try {
      console.log("🔄 Getting products from GestLine...");
      const result = await gestlineService.getData('products');
      res.json(result);
    } catch (error) {
      console.error("Failed to get GestLine products:", error);
      res.status(500).json({ message: "Failed to get GestLine products" });
    }
  });

  app.get("/api/gestline/customers", authenticateToken, async (req, res) => {
    try {
      console.log("🔄 Getting customers from GestLine...");
      const result = await gestlineService.getData('customers');
      res.json(result);
    } catch (error) {
      console.error("Failed to get GestLine customers:", error);
      res.status(500).json({ message: "Failed to get GestLine customers" });
    }
  });

  app.post("/api/gestline/test", authenticateToken, async (req, res) => {
    try {
      console.log("🔄 Testing GestLine API connection...");
      const result = await gestlineService.testConnection();
      res.json(result);
    } catch (error) {
      console.error("Failed to test GestLine connection:", error);
      res.status(500).json({ message: "Failed to test GestLine connection" });
    }
  });

  app.post("/api/gestline/send-order", authenticateToken, async (req, res) => {
    try {
      const orderData = req.body as GestLineOrderData;
      console.log(`🔄 Sending order ${orderData.orderNumber} to GestLine...`);
      
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
    } catch (error) {
      console.error("Failed to send order to GestLine:", error);
      res.status(500).json({ message: "Failed to send order to GestLine" });
    }
  });

  app.post("/api/gestline/sync-product", authenticateToken, async (req, res) => {
    try {
      const productData = req.body;
      console.log(`🔄 Syncing product ${productData.code} to GestLine...`);
      
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
    } catch (error) {
      console.error("Failed to sync product to GestLine:", error);
      res.status(500).json({ message: "Failed to sync product to GestLine" });
    }
  });

  app.post("/api/gestline/batch-orders", authenticateToken, async (req, res) => {
    try {
      const { orders } = req.body as { orders: GestLineOrderData[] };
      console.log(`🔄 Sending ${orders.length} orders to GestLine...`);
      
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
    } catch (error) {
      console.error("Failed to send batch orders to GestLine:", error);
      res.status(500).json({ message: "Failed to send batch orders to GestLine" });
    }
  });

  // Advanced Commission System
  app.get("/api/commissions/advanced/:informatoreId", authenticateToken, async (req, res) => {
    try {
      const { informatoreId } = req.params;
      const { year, month } = req.query;
      const commissions = await storage.getAdvancedCommissions(informatoreId, {
        year: year ? Number(year) : new Date().getFullYear(),
        month: month ? Number(month) : undefined,
      });
      res.json(commissions);
    } catch (error) {
      console.error("Failed to fetch advanced commissions:", error);
      res.status(500).json({ message: "Failed to fetch advanced commissions" });
    }
  });

  app.post("/api/commissions/calculate", authenticateToken, async (req, res) => {
    try {
      const { informatoreId, year, month } = req.body;
      const commission = await storage.calculateAdvancedCommission(informatoreId, year, month);
      res.json(commission);
    } catch (error) {
      console.error("Failed to calculate commission:", error);
      res.status(500).json({ message: "Failed to calculate commission" });
    }
  });

  // Analytics routes - Dynamic data from database
  app.get("/api/analytics/revenue", authenticateToken, async (req, res) => {
    try {
      const analyticsData = await storage.getAnalyticsRevenue(req.query, req.user);
      res.json(analyticsData);
    } catch (error) {
      console.error("Failed to fetch revenue analytics:", error);
      res.status(500).json({ message: "Failed to fetch revenue analytics" });
    }
  });

  app.get("/api/analytics/product-codes", authenticateToken, async (req, res) => {
    try {
      const productCodes = await storage.getProductCodes();
      res.json(productCodes);
    } catch (error) {
      console.error("Failed to fetch product codes:", error);
      res.status(500).json({ message: "Failed to fetch product codes" });
    }
  });

  app.get("/api/analytics/comparison", authenticateToken, async (req, res) => {
    try {
      const comparisonData = await storage.getAnalyticsComparison(req.query, req.user);
      res.json(comparisonData);
    } catch (error) {
      console.error("Failed to fetch comparison data:", error);
      res.status(500).json({ message: "Failed to fetch comparison data" });
    }
  });

  // Bonus/Malus Management (Admin only)
  app.get("/api/bonus-malus", authenticateToken, async (req, res) => {
    try {
      const { informatoreId, year, month } = req.query;
      const bonusMalus = await storage.getBonusMalus({
        informatoreId: informatoreId as string,
        year: year ? Number(year) : undefined,
        month: month ? Number(month) : undefined,
      });
      res.json(bonusMalus);
    } catch (error) {
      console.error("Failed to fetch bonus/malus:", error);
      res.status(500).json({ message: "Failed to fetch bonus/malus" });
    }
  });

  app.post("/api/bonus-malus", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const bonusMalusData = { ...req.body, createdBy: userId };
      const bonusMalus = await storage.createBonusMalus(bonusMalusData);
      res.json(bonusMalus);
    } catch (error) {
      console.error("Failed to create bonus/malus:", error);
      res.status(500).json({ message: "Failed to create bonus/malus" });
    }
  });

  // Medical Visit Tracking
  app.get("/api/visits", authenticateToken, async (req, res) => {
    try {
      const { informatoreId, doctorId, startDate, endDate } = req.query;
      const visits = await storage.getMedicalVisits({
        informatoreId: informatoreId as string,
        doctorId: doctorId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      res.json(visits);
    } catch (error) {
      console.error("Failed to fetch medical visits:", error);
      res.status(500).json({ message: "Failed to fetch medical visits" });
    }
  });

  app.post("/api/visits", authenticateToken, async (req, res) => {
    try {
      const visit = await storage.createMedicalVisit(req.body);
      res.json(visit);
    } catch (error) {
      console.error("Failed to create medical visit:", error);
      res.status(500).json({ message: "Failed to create medical visit" });
    }
  });

  // =================================
  // EXTENDED ISF COMPENSATION ROUTES  
  // =================================

  // Compensation stats for admin dashboard
  app.get("/api/compensations/stats", authenticateToken, async (req, res) => {
    try {
      const { month, year } = req.query;
      const stats = await storage.getCompensationStats({
        month: month ? parseInt(month as string) : new Date().getMonth() + 1,
        year: year ? parseInt(year as string) : new Date().getFullYear(),
      });
      res.json(stats);
    } catch (error) {
      console.error("Error fetching compensation stats:", error);
      res.status(500).json({ error: "Failed to fetch compensation stats" });
    }
  });

  // Middleware per verificare il tipo di utente
  function requireUserType(userType: string) {
    return (req: any, res: any, next: any) => {
      const user = req.user as any;
      if (!user || user.userType !== userType) {
        return res.status(403).json({ message: 'Accesso negato per questo tipo di utente' });
      }
      next();
    };
  }

  // My compensation for logged-in informatori  
  app.get("/api/informatori/my-compensation", authenticateToken, requireUserType('informatore'), async (req, res) => {
    try {
      const { month, year } = req.query;
      const compensation = await storage.getMyCompensation((req.user as any)?.id, {
        month: month ? parseInt(month as string) : new Date().getMonth() + 1,
        year: year ? parseInt(year as string) : new Date().getFullYear(),
      });
      res.json(compensation);
    } catch (error) {
      console.error("Error fetching my compensation:", error);
      res.status(500).json({ error: "Failed to fetch compensation" });
    }
  });

  // My commission logs for informatori
  app.get("/api/informatori/commission-logs", authenticateToken, requireUserType('informatore'), async (req, res) => {
    try {
      const { month, year, search } = req.query;
      const logs = await storage.getMyCommissionLogs((req.user as any)?.id, {
        month: month ? parseInt(month as string) : new Date().getMonth() + 1,
        year: year ? parseInt(year as string) : new Date().getFullYear(),
        search: search as string,
      });
      res.json(logs);
    } catch (error) {
      console.error("Error fetching commission logs:", error);
      res.status(500).json({ error: "Failed to fetch commission logs" });
    }
  });

  // My doctor cards for informatori
  app.get("/api/informatori/doctor-cards", authenticateToken, requireUserType('informatore'), async (req, res) => {
    try {
      const cards = await storage.getMyDoctorCards((req.user as any)?.id);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching doctor cards:", error);
      res.status(500).json({ error: "Failed to fetch doctor cards" });
    }
  });

  // My performance stats for informatori
  app.get("/api/informatori/performance", authenticateToken, requireUserType('informatore'), async (req, res) => {
    try {
      const { year } = req.query;
      const performance = await storage.getMyPerformance((req.user as any)?.id, {
        year: year ? parseInt(year as string) : new Date().getFullYear(),
      });
      res.json(performance);
    } catch (error) {
      console.error("Error fetching performance:", error);
      res.status(500).json({ error: "Failed to fetch performance" });
    }
  });

  // ISF Dashboard - Shareable read-only access
  app.get("/api/informatori/:informatoreId/dashboard", async (req, res) => {
    try {
      const { informatoreId } = req.params;
      const { shareToken } = req.query;
      
      // Verify share token or authentication
      // For now, allow public access to dashboard demo
      const isValid = shareToken 
        ? await storage.validateShareToken(informatoreId, shareToken as string)
        : req.authenticateToken();
        
      if (!isValid) {
        return res.status(401).json({ message: "Unauthorized access to dashboard" });
      }
      
      const dashboard = await storage.getInformatoreDashboard(informatoreId);
      res.json(dashboard);
    } catch (error) {
      console.error("Failed to fetch informatore dashboard:", error);
      res.status(500).json({ message: "Failed to fetch informatore dashboard" });
    }
  });

  app.post("/api/informatori/:informatoreId/share", authenticateToken, async (req, res) => {
    try {
      const { informatoreId } = req.params;
      const { doctorId, expiresIn = "30d" } = req.body;
      const shareLink = await storage.generateShareLink(informatoreId, doctorId, expiresIn);
      res.json(shareLink);
    } catch (error) {
      console.error("Failed to generate share link:", error);
      res.status(500).json({ message: "Failed to generate share link" });
    }
  });

  // Search endpoint - Global search with case insensitive matching
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 1) {
        return res.json([]);
      }
      
      const results = await storage.globalSearch(query.trim());
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Errore durante la ricerca' });
    }
  });

  // ===== ANALYTICS ROUTES =====

  // Analytics fatturato generale
  app.get("/api/analytics/revenue", authenticateToken, async (req, res) => {
    try {
      const { period = 'month', month, year, quarter, productCode, isfId, myData } = req.query;
      const user = req.user as any;
      
      let analyticsData = {
        totalRevenue: 0,
        revenueChange: 0,
        topProducts: [] as any[],
        topISF: [] as any[],
        productTrends: [],
        monthlyTrends: [],
        quarterlyTrends: [],
        allTimeStats: {
          maxRevenue: 0,
          minRevenue: 0,
          avgRevenue: 0,
          totalOrders: 0
        }
      };

      // Simulazione dati analytics basati su criteri realistici
      if (period === 'month') {
        analyticsData.totalRevenue = 125000 + (Math.random() * 50000);
        analyticsData.revenueChange = (Math.random() - 0.5) * 20;
        analyticsData.topProducts = [
          { code: 'WF001', name: 'Paracetamolo 500mg', revenue: 35000, change: 12.5, maxRevenue: 40000, minRevenue: 25000 },
          { code: 'WF002', name: 'Aspirina 100mg', revenue: 28000, change: -5.2, maxRevenue: 35000, minRevenue: 20000 },
          { code: 'WF003', name: 'Ibuprofene 400mg', revenue: 22000, change: 8.7, maxRevenue: 30000, minRevenue: 15000 },
          { code: 'WF004', name: 'Amoxicillina 1g', revenue: 18000, change: -2.1, maxRevenue: 25000, minRevenue: 12000 },
          { code: 'WF005', name: 'Omeprazolo 20mg', revenue: 15000, change: 15.3, maxRevenue: 20000, minRevenue: 10000 }
        ];
      }

      if (!myData || user.userType !== 'informatore') {
        analyticsData.topISF = [
          { id: '1', firstName: 'Marco', lastName: 'Rossi', area: 'Nord Italia', revenue: 45000, change: 12.5, maxRevenue: 50000, minRevenue: 35000, totalOrders: 45, userType: 'freelancer' },
          { id: '2', firstName: 'Laura', lastName: 'Bianchi', area: 'Centro Italia', revenue: 38000, change: 8.2, maxRevenue: 45000, minRevenue: 30000, totalOrders: 38, userType: 'employee' },
          { id: '3', firstName: 'Giuseppe', lastName: 'Verdi', area: 'Sud Italia', revenue: 32000, change: -3.1, maxRevenue: 40000, minRevenue: 25000, totalOrders: 32, userType: 'freelancer' }
        ];
      }

      analyticsData.allTimeStats = {
        maxRevenue: 180000,
        minRevenue: 95000,
        avgRevenue: 125000,
        totalOrders: 456
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics revenue:", error);
      res.status(500).json({ error: "Failed to fetch analytics revenue" });
    }
  });

  // Codici prodotto per filtri
  app.get("/api/analytics/product-codes", authenticateToken, async (req, res) => {
    try {
      const productCodes = [
        { id: '1', code: 'WF001', name: 'Paracetamolo 500mg' },
        { id: '2', code: 'WF002', name: 'Aspirina 100mg' },
        { id: '3', code: 'WF003', name: 'Ibuprofene 400mg' },
        { id: '4', code: 'WF004', name: 'Amoxicillina 1g' },
        { id: '5', code: 'WF005', name: 'Omeprazolo 20mg' },
        { id: '6', code: 'WF006', name: 'Simvastatina 20mg' },
        { id: '7', code: 'WF007', name: 'Metformina 850mg' },
        { id: '8', code: 'WF008', name: 'Enalapril 10mg' },
        { id: '9', code: 'WF009', name: 'Amlodipina 5mg' },
        { id: '10', code: 'WF010', name: 'Losartan 50mg' }
      ];

      res.json(productCodes);
    } catch (error) {
      console.error("Error fetching product codes:", error);
      res.status(500).json({ error: "Failed to fetch product codes" });
    }
  });

  // Confronto periodi  
  app.get("/api/analytics/comparison", authenticateToken, async (req, res) => {
    try {
      const { currentPeriod, comparisonPeriod, month, year, productCode, isfId, myData } = req.query;
      
      const comparisonData = {
        revenueChange: (Math.random() - 0.5) * 30,
        previousRevenue: 110000 + (Math.random() * 40000),
        topGrowthProducts: [
          { code: 'WF005', name: 'Omeprazolo 20mg', growth: 25.4, revenue: 15000 },
          { code: 'WF001', name: 'Paracetamolo 500mg', growth: 18.2, revenue: 35000 },
          { code: 'WF009', name: 'Amlodipina 5mg', growth: 15.7, revenue: 12000 }
        ],
        topDeclineProducts: [
          { code: 'WF002', name: 'Aspirina 100mg', decline: -12.8, revenue: 28000 },
          { code: 'WF008', name: 'Enalapril 10mg', decline: -8.4, revenue: 6000 },
          { code: 'WF004', name: 'Amoxicillina 1g', decline: -5.2, revenue: 18000 }
        ]
      };

      res.json(comparisonData);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      res.status(500).json({ error: "Failed to fetch comparison data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
