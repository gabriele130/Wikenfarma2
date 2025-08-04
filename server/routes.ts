import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCustomerSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertInformatoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Customer routes
  app.get('/api/customers', isAuthenticated, async (req, res) => {
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

  app.get('/api/customers/:id', isAuthenticated, async (req, res) => {
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

  app.post('/api/customers', isAuthenticated, async (req, res) => {
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

  app.put('/api/customers/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/customers/:id', isAuthenticated, async (req, res) => {
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
  app.get('/api/products', isAuthenticated, async (req, res) => {
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

  app.get('/api/products/low-stock', isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
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
  app.get('/api/orders', isAuthenticated, async (req, res) => {
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

  app.get('/api/orders/recent', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const orders = await storage.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const orderSchema = insertOrderSchema.extend({
        items: z.array(insertOrderItemSchema)
      });
      
      const { items, ...orderData } = orderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, items);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
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

  app.put('/api/orders/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as any)?.claims?.sub,
        action: 'update',
        entityType: 'order',
        entityId: order.id,
        description: `Aggiornato ordine: ${order.orderNumber}`,
      });
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Shipment routes
  app.get('/api/shipments', isAuthenticated, async (req, res) => {
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
  app.get('/api/commissions', isAuthenticated, async (req, res) => {
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
  app.get('/api/integrations', isAuthenticated, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Activity log routes
  app.get('/api/activity-logs', isAuthenticated, async (req, res) => {
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
  app.get('/api/informatori', isAuthenticated, async (req, res) => {
    try {
      const informatori = await storage.getInformatori();
      res.json(informatori);
    } catch (error) {
      console.error("Error fetching informatori:", error);
      res.status(500).json({ message: "Failed to fetch informatori" });
    }
  });

  app.post('/api/informatori', isAuthenticated, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
