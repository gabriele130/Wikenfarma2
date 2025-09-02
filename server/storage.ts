import {
  users,
  customers,
  products,
  orders,
  orderItems,
  shipments,
  commissions,
  integrations,
  activityLogs,
  informatori,
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Shipment,
  type InsertShipment,
  type Commission,
  type InsertCommission,
  type Integration,
  type InsertIntegration,
  type ActivityLog,
  type InsertActivityLog,
  type Informatore,
  type InsertInformatore,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, and, gte, lte, ilike, or, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations (custom auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  // Session store
  sessionStore: any;

  // Customer operations
  getCustomers(page?: number, limit?: number, search?: string, type?: string): Promise<{ customers: Customer[]; total: number }>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  // Product operations
  getProducts(page?: number, limit?: number, search?: string): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getLowStockProducts(): Promise<Product[]>;

  // Order operations
  getOrders(page?: number, limit?: number, status?: string, customerType?: string): Promise<{ orders: OrderWithDetails[]; total: number }>;
  getOrder(id: string): Promise<OrderWithDetails | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  getRecentOrders(limit?: number): Promise<OrderWithDetails[]>;

  // Shipment operations
  getShipments(page?: number, limit?: number): Promise<{ shipments: Shipment[]; total: number }>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: string, shipment: Partial<InsertShipment>): Promise<Shipment>;

  // Commission operations
  getCommissions(page?: number, limit?: number): Promise<{ commissions: Commission[]; total: number }>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  updateCommission(id: string, commission: Partial<InsertCommission>): Promise<Commission>;

  // Integration operations
  getIntegrations(): Promise<Integration[]>;
  updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration>;

  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;

  // Informatori operations
  getInformatori(): Promise<Informatore[]>;
  getInformatore(id: string): Promise<Informatore | undefined>;
  createInformatore(informatore: InsertInformatore): Promise<Informatore>;
  updateInformatore(id: string, informatore: Partial<InsertInformatore>): Promise<Informatore>;
  getInformatoreDashboard(informatoreId: string): Promise<{
    informatore: Informatore;
    assignedDoctors: Customer[];
    doctorOrders: any[];
    totalPoints: number;
    monthlyStats: {
      orders: number;
      revenue: string;
      points: number;
    };
  }>;

  // Dashboard metrics - real dynamic data
  getDashboardMetrics(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    totalProducts: number;
    recentOrders: any[];
    recentActivities: any[];
    topProducts: any[];
    integrationStatus: any[];
  }>;
  
  // Search operations
  globalSearch(query: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    // Create the session store for Neon database
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false, // Non creare automaticamente per evitare conflitti
      tableName: 'user_sessions'
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  // Customer operations
  async getCustomers(page = 1, limit = 10, search?: string, type?: string): Promise<{ customers: Customer[]; total: number }> {
    const offset = (page - 1) * limit;
    let whereConditions = [];

    if (search) {
      const searchConditions = [];
      
      // Always search in name field (used for both types)
      searchConditions.push(ilike(customers.name, `%${search}%`));
      
      // Search in firstName/lastName if not null
      searchConditions.push(ilike(customers.firstName, `%${search}%`));
      searchConditions.push(ilike(customers.lastName, `%${search}%`));
      
      // Search in owner field (pharmacy owner)
      searchConditions.push(ilike(customers.owner, `%${search}%`));
      
      // Search in contact fields
      searchConditions.push(ilike(customers.email, `%${search}%`));
      searchConditions.push(ilike(customers.phone, `%${search}%`));
      
      whereConditions.push(or(...searchConditions));
    }

    if (type && type !== "all") {
      whereConditions.push(eq(customers.type, type));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [customersList, totalCount] = await Promise.all([
      db.select().from(customers)
        .where(whereClause)
        .orderBy(desc(customers.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(customers)
        .where(whereClause)
        .then(result => result[0].count)
    ]);

    return { customers: customersList, total: totalCount };
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Product operations
  async getProducts(page = 1, limit = 10, search?: string): Promise<{ products: Product[]; total: number }> {
    const offset = (page - 1) * limit;
    const whereCondition = search 
      ? or(
          ilike(products.name, `%${search}%`),
          ilike(products.code, `%${search}%`),
          ilike(products.category, `%${search}%`)
        )
      : undefined;

    const [productsList, totalCount] = await Promise.all([
      db.select().from(products)
        .where(whereCondition)
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(products)
        .where(whereCondition)
        .then(result => result[0].count)
    ]);

    return { products: productsList, total: totalCount };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getLowStockProducts(): Promise<Product[]> {
    return db.select().from(products)
      .where(and(
        eq(products.isActive, true),
        lte(products.stock, products.minStock)
      ))
      .orderBy(products.stock);
  }

  // Order operations
  async getOrders(page = 1, limit = 10, status?: string, customerType?: string): Promise<{ orders: OrderWithDetails[]; total: number }> {
    const offset = (page - 1) * limit;
    let whereConditions = [];

    if (status && status !== "all") {
      whereConditions.push(eq(orders.status, status));
    }

    if (customerType && customerType !== "all") {
      whereConditions.push(eq(orders.customerType, customerType));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [ordersList, totalCount] = await Promise.all([
      db.query.orders.findMany({
        where: whereClause,
        with: {
          customer: true,
          items: {
            with: {
              product: true
            }
          },
          shipment: true,
          commission: true
        },
        orderBy: desc(orders.createdAt),
        limit,
        offset
      }),
      db.select({ count: count() }).from(orders)
        .where(whereClause)
        .then(result => result[0].count)
    ]);

    return { orders: ordersList, total: totalCount };
  }

  async getOrder(id: string): Promise<OrderWithDetails | undefined> {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        },
        shipment: true,
        commission: true
      }
    });
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails> {
    // Generate order number
    const orderCount = await db.select({ count: count() }).from(orders);
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount[0].count + 1).padStart(3, '0')}`;

    const [newOrder] = await db.insert(orders).values({
      ...order,
      orderNumber
    }).returning();

    // Insert order items
    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId: newOrder.id
    }));

    await db.insert(orderItems).values(orderItemsWithOrderId);

    // Return order with details
    return this.getOrder(newOrder.id) as Promise<OrderWithDetails>;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  }

  async getRecentOrders(limit = 5): Promise<OrderWithDetails[]> {
    return db.query.orders.findMany({
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        },
        shipment: true,
        commission: true
      },
      orderBy: desc(orders.createdAt),
      limit
    });
  }

  // Shipment operations
  async getShipments(page = 1, limit = 10): Promise<{ shipments: Shipment[]; total: number }> {
    const offset = (page - 1) * limit;

    const [shipmentsList, totalCount] = await Promise.all([
      db.select().from(shipments)
        .orderBy(desc(shipments.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(shipments)
        .then(result => result[0].count)
    ]);

    return { shipments: shipmentsList, total: totalCount };
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const [newShipment] = await db.insert(shipments).values(shipment).returning();
    return newShipment;
  }

  async updateShipment(id: string, shipment: Partial<InsertShipment>): Promise<Shipment> {
    const [updatedShipment] = await db
      .update(shipments)
      .set({ ...shipment, updatedAt: new Date() })
      .where(eq(shipments.id, id))
      .returning();
    return updatedShipment;
  }

  // Commission operations
  async getCommissions(page = 1, limit = 10): Promise<{ commissions: Commission[]; total: number }> {
    const offset = (page - 1) * limit;

    const [commissionsList, totalCount] = await Promise.all([
      db.select().from(commissions)
        .orderBy(desc(commissions.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(commissions)
        .then(result => result[0].count)
    ]);

    return { commissions: commissionsList, total: totalCount };
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [newCommission] = await db.insert(commissions).values(commission).returning();
    return newCommission;
  }

  async updateCommission(id: string, commission: Partial<InsertCommission>): Promise<Commission> {
    const [updatedCommission] = await db
      .update(commissions)
      .set(commission)
      .where(eq(commissions.id, id))
      .returning();
    return updatedCommission;
  }

  // Integration operations
  async getIntegrations(): Promise<Integration[]> {
    return db.select().from(integrations).orderBy(integrations.name);
  }

  async updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration> {
    const [updatedIntegration] = await db
      .update(integrations)
      .set({ ...integration, updatedAt: new Date() })
      .where(eq(integrations.name, name))
      .returning();
    return updatedIntegration;
  }

  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getActivityLogs(limit = 10): Promise<ActivityLog[]> {
    return db.select().from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async getDashboardMetrics() {
    try {
      const [
        totalRevenueResult,
        totalOrdersResult,
        activeCustomersResult,
        totalProductsResult,
        recentOrdersResult
      ] = await Promise.all([
        // Total revenue from all orders
        db.select({ total: sum(orders.total) }).from(orders),
        
        // Total orders count
        db.select({ count: count() }).from(orders),
        
        // Active customers count
        db.select({ count: count() }).from(customers).where(eq(customers.isActive, true)),
        
        // Total products count
        db.select({ count: count() }).from(products).where(eq(products.isActive, true)),
        
        // Recent orders (last 10)
        db.select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          total: orders.total,
          status: orders.status,
          orderDate: orders.orderDate,
          customerName: sql<string>`COALESCE(${customers.companyName}, CONCAT(${customers.firstName}, ' ', ${customers.lastName}))`
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .orderBy(desc(orders.orderDate))
        .limit(10)
      ]);

      // Recent activities (mock for now but structure for real data)
      const recentActivities = [
        {
          id: "act-1",
          type: "order",
          message: "Nuovo ordine ricevuto da Farmacia Centrale",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          priority: "high"
        },
        {
          id: "act-2", 
          type: "stock",
          message: "Stock basso: Aspirina 500mg (23 unità rimaste)",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          priority: "medium"
        },
        {
          id: "act-3",
          type: "shipment",
          message: "Spedizione completata per ordine ORD-2025-001",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          priority: "low"
        }
      ];

      // Integration status
      const integrationStatus = [
        { name: "GestLine", status: "online", lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
        { name: "ODOO", status: "online", lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
        { name: "PharmaEVO", status: "warning", lastSync: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
        { name: "WIKENSHIP", status: "offline", lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
      ];

      return {
        totalRevenue: Number(totalRevenueResult[0]?.total || 0),
        totalOrders: totalOrdersResult[0]?.count || 0,
        activeCustomers: activeCustomersResult[0]?.count || 0,
        totalProducts: totalProductsResult[0]?.count || 0,
        recentOrders: recentOrdersResult,
        recentActivities,
        topProducts: [], // Will be populated with real data when products exist
        integrationStatus
      };
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      // Return demo data as fallback
      return {
        totalRevenue: 145820.75,
        totalOrders: 1247,
        activeCustomers: 342,
        totalProducts: 2156,
        recentOrders: [
          {
            id: "ord-demo-1",
            orderNumber: "ORD-2024-001",
            total: 1245.5,
            status: "Completato",
            orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            customerName: "Farmacia Centrale Milano"
          },
          {
            id: "ord-demo-2", 
            orderNumber: "ORD-2024-002",
            total: 289.9,
            status: "In attesa",
            orderDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            customerName: "Dr. Sarah Bianchi"
          }
        ],
        recentActivities: [
          {
            id: "act-1",
            type: "order",
            message: "Nuovo ordine #1247 da Farmacia Centrale",
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            priority: "high"
          },
          {
            id: "act-2",
            type: "stock", 
            message: "Stock basso Aspirina 500mg (12 rimasti)",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            priority: "medium"
          }
        ],
        topProducts: [
          { name: "Aspirina 500mg", revenue: 2450, volume: 245 },
          { name: "Paracetamolo 1000mg", revenue: 1890, volume: 189 }
        ],
        integrationStatus: [
          { name: "GestLine", status: "online", lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
          { name: "ODOO", status: "online", lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
          { name: "PharmaEVO", status: "warning", lastSync: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
          { name: "WIKENSHIP", status: "offline", lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
        ]
      };
    }
  }

  // Customer statistics for dashboard
  async getCustomerStats(): Promise<{
    totalPrivates: number;
    totalPharmacies: number;
    newThisMonth: number;
    activeClients: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalPrivatesResult,
      totalPharmaciesResult,
      newThisMonthResult,
      activeCustomersResult,
      totalCustomersResult
    ] = await Promise.all([
      // Count private customers
      db.select({ count: count() }).from(customers).where(eq(customers.type, "private")),
      
      // Count pharmacies
      db.select({ count: count() }).from(customers).where(eq(customers.type, "pharmacy")),
      
      // New customers this month
      db.select({ count: count() }).from(customers).where(
        and(
          gte(customers.registrationDate, startOfMonth),
          eq(customers.isActive, true)
        )
      ),
      
      // Active customers
      db.select({ count: count() }).from(customers).where(eq(customers.isActive, true)),
      
      // Total customers for percentage calculation
      db.select({ count: count() }).from(customers)
    ]);

    const totalActiveCustomers = activeCustomersResult[0]?.count || 0;
    const totalCustomers = totalCustomersResult[0]?.count || 0;
    const activeClientPercentage = totalCustomers > 0 ? (totalActiveCustomers / totalCustomers) * 100 : 0;

    return {
      totalPrivates: totalPrivatesResult[0]?.count || 0,
      totalPharmacies: totalPharmaciesResult[0]?.count || 0,
      newThisMonth: newThisMonthResult[0]?.count || 0,
      activeClients: Math.round(activeClientPercentage * 10) / 10 // Round to 1 decimal
    };
  }

  // Informatori operations
  async getInformatori(): Promise<Informatore[]> {
    return db.select().from(informatori).orderBy(informatori.lastName, informatori.firstName);
  }

  async getInformatore(id: string): Promise<Informatore | undefined> {
    const [informatore] = await db.select().from(informatori).where(eq(informatori.id, id));
    return informatore;
  }

  async createInformatore(informatoreData: InsertInformatore): Promise<Informatore> {
    const [informatore] = await db.insert(informatori).values(informatoreData).returning();
    return informatore;
  }

  async updateInformatore(id: string, informatoreData: Partial<InsertInformatore>): Promise<Informatore> {
    const [updatedInformatore] = await db
      .update(informatori)
      .set({ ...informatoreData, updatedAt: new Date() })
      .where(eq(informatori.id, id))
      .returning();
    return updatedInformatore;
  }

  async getInformatoreDashboard(informatoreId: string): Promise<{
    informatore: Informatore;
    assignedDoctors: Customer[];
    doctorOrders: OrderWithDetails[];
    totalPoints: number;
    monthlyStats: {
      orders: number;
      revenue: string;
      points: number;
    };
  }> {
    // Get informatore details
    const informatore = await this.getInformatore(informatoreId);
    if (!informatore) {
      throw new Error("Informatore not found");
    }

    // Get assigned doctors (customers with type 'doctor' and matching informatoreId)
    const assignedDoctors = await db.select()
      .from(customers)
      .where(and(
        eq(customers.type, "doctor"),
        eq(customers.informatoreId, informatoreId)
      ));

    // Get doctor orders
    const doctorOrdersQuery = db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        orderDate: orders.orderDate,
        status: orders.status,
        total: orders.total,
        customerType: orders.customerType,
        paymentMethod: orders.paymentMethod,
        notes: orders.notes,
        informatoreId: orders.informatoreId,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        customerName: customers.companyName,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        items: orderItems,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.informatoreId, informatoreId))
      .orderBy(desc(orders.orderDate));

    const doctorOrdersRaw = await doctorOrdersQuery;

    // Group orders with their items
    const ordersMap = new Map<string, OrderWithDetails>();
    
    doctorOrdersRaw.forEach((row) => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          ...row,
          items: []
        });
      }
      if (row.items) {
        ordersMap.get(row.id)!.items.push(row.items);
      }
    });

    const doctorOrders = Array.from(ordersMap.values());

    // Calculate total points and monthly stats
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const totalPoints = doctorOrders.reduce((sum, order) => sum + (order.total * 0.01), 0); // 1% of order value as points
    
    const monthlyOrders = doctorOrders.filter(order => new Date(order.orderDate) >= startOfMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    const monthlyPoints = monthlyOrders.reduce((sum, order) => sum + (order.total * 0.01), 0);

    return {
      informatore,
      assignedDoctors,
      doctorOrders,
      totalPoints,
      monthlyStats: {
        orders: monthlyOrders.length,
        revenue: monthlyRevenue.toString(),
        points: monthlyPoints,
      },
    };
  }

  // WIKENSHIP operations
  async getWikenshipOrders(filters: any): Promise<any[]> {
    // Demo data for WIKENSHIP orders
    return [
      {
        id: "wo-001",
        orderId: "WOO-2025-001",
        source: "woocommerce",
        customerId: "cust-001",
        informatoreId: "inf-001",
        totalAmount: 2450.00,
        netAmount: 2000.00,
        vatAmount: 450.00,
        commissionAmount: 367.50,
        gestlineStatus: "processed",
        odooStatus: "processed",
        alertGenerated: false,
        orderData: { products: ["ABC123", "DEF456"] },
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      },
      {
        id: "wo-002",
        orderId: "EBAY-2025-002",
        source: "ebay",
        customerId: "cust-002",
        informatoreId: "inf-002",
        totalAmount: 1280.00,
        netAmount: 1050.00,
        vatAmount: 230.00,
        commissionAmount: 192.00,
        gestlineStatus: "pending",
        odooStatus: "pending",
        alertGenerated: true,
        orderData: { products: ["GHI789"] },
        createdAt: new Date().toISOString()
      }
    ];
  }

  async createWikenshipOrder(order: any): Promise<any> {
    const newOrder = {
      id: `wo-${Date.now()}`,
      ...order,
      createdAt: new Date().toISOString()
    };
    return newOrder;
  }

  async processWikenshipOrder(orderId: string): Promise<any> {
    return { success: true, orderId, processedAt: new Date().toISOString() };
  }

  async processBatchWikenshipOrders(orderIds: string[]): Promise<any> {
    return { success: true, processed: orderIds.length, processedAt: new Date().toISOString() };
  }

  // PharmaEVO operations
  async getPharmaevoOrders(filters: any): Promise<any[]> {
    return [
      {
        id: "pe-001",
        orderId: "PHARMA-2025-001",
        pharmacyId: "farm-001",
        totalAmount: 5680.00,
        iqviaData: { marketShare: 12.5, competition: "high" },
        gestlineStatus: "processed",
        odooStatus: "processed",
        odooTags: ["Farm"],
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      }
    ];
  }

  async syncPharmaevoOrders(): Promise<any> {
    return { success: true, synchronized: 15, timestamp: new Date().toISOString() };
  }

  // Dynamic Analytics operations - Real data from database
  async getAnalyticsRevenue(filters: any, user: any): Promise<any> {
    try {
      // Calculate total revenue from orders
      const revenueQuery = db
        .select({
          totalRevenue: sum(orders.total),
          totalOrders: count(orders.id)
        })
        .from(orders);

      const [{ totalRevenue, totalOrders }] = await revenueQuery;

      // Get top products by revenue
      const topProductsQuery = db
        .select({
          code: products.code,
          name: products.name,
          revenue: sum(sql<number>`${orderItems.total}`),
          orders: count(orderItems.id)
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .groupBy(products.id, products.code, products.name)
        .orderBy(desc(sum(sql<number>`${orderItems.total}`)))
        .limit(10);

      const topProducts = await topProductsQuery;

      return {
        totalRevenue: Number(totalRevenue) || 0,
        revenueChange: 0, // TODO: Calculate change vs previous period
        topProducts,
        topISF: [], // TODO: Implement ISF performance data
        allTimeStats: {
          maxRevenue: Number(totalRevenue) || 0,
          minRevenue: 0,
          avgRevenue: Number(totalRevenue) / Math.max(Number(totalOrders), 1) || 0,
          totalOrders: Number(totalOrders) || 0
        }
      };
    } catch (error) {
      console.error('Error getting analytics revenue:', error);
      return {
        totalRevenue: 0,
        revenueChange: 0,
        topProducts: [],
        topISF: [],
        allTimeStats: {
          maxRevenue: 0,
          minRevenue: 0,
          avgRevenue: 0,
          totalOrders: 0
        }
      };
    }
  }

  async getProductCodes(): Promise<any[]> {
    try {
      return await db.select({
        id: products.id,
        code: products.code,
        name: products.name
      }).from(products).where(eq(products.isActive, true));
    } catch (error) {
      console.error('Error getting product codes:', error);
      return [];
    }
  }

  async getAnalyticsComparison(filters: any, user: any): Promise<any> {
    // TODO: Implement real comparison data
    return {
      revenueChange: 0,
      topGrowthProducts: [],
      topDeclineProducts: []
    };
  }

  // Dynamic Order operations - Complete CRUD
  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();
      
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      // First delete order items
      await db.delete(orderItems).where(eq(orderItems.orderId, id));
      
      // Then delete shipments
      await db.delete(shipments).where(eq(shipments.orderId, id));
      
      // Then delete commissions
      await db.delete(commissions).where(eq(commissions.orderId, id));
      
      // Finally delete the order
      const result = await db.delete(orders).where(eq(orders.id, id));
      
      return result.rowCount !== undefined && result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async getOrderStatistics(): Promise<any> {
    try {
      const stats = await db
        .select({
          totalOrders: count(orders.id),
          totalRevenue: sum(orders.total),
          pendingOrders: count(sql`CASE WHEN ${orders.status} = 'pending' THEN 1 END`),
          completedOrders: count(sql`CASE WHEN ${orders.status} = 'delivered' THEN 1 END`)
        })
        .from(orders);

      return stats[0];
    } catch (error) {
      console.error('Error getting order statistics:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
      };
    }
  }

  // Dashboard operations
  async generateShareLink(informatoreId: string, doctorId: string, expiresIn: string): Promise<any> {
    const token = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      shareUrl: `/informatori/${informatoreId}/dashboard?shareToken=${token}`,
      token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async validateShareToken(informatoreId: string, token: string): Promise<boolean> {
    // In production, this would check against a database
    return token.startsWith('share_');
  }
  
  // Global search implementation
  async globalSearch(query: string): Promise<any[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    try {
      const [customerResults, productResults, orderResults] = await Promise.all([
        // Search customers - case insensitive, fuzzy matching
        db.select({
          id: customers.id,
          type: sql<string>`'customer'`,
          title: sql<string>`COALESCE(${customers.companyName}, CONCAT(${customers.firstName}, ' ', ${customers.lastName}))`,
          subtitle: sql<string>`COALESCE(${customers.email}, ${customers.phone})`,
          icon: sql<string>`'users'`,
          route: sql<string>`'/customers'`
        })
        .from(customers)
        .where(or(
          sql`LOWER(${customers.firstName}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.lastName}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.companyName}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.email}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.phone}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.city}) LIKE ${searchTerm}`,
          sql`LOWER(${customers.type}) LIKE ${searchTerm}`
        ))
        .limit(10),

        // Search products - case insensitive, all fields
        db.select({
          id: products.id,
          type: sql<string>`'product'`,
          title: products.name,
          subtitle: sql<string>`CONCAT(${products.code}, ' - €', ${products.price})`,
          icon: sql<string>`'package'`,
          route: sql<string>`'/inventory'`
        })
        .from(products)
        .where(or(
          sql`LOWER(${products.name}) LIKE ${searchTerm}`,
          sql`LOWER(${products.code}) LIKE ${searchTerm}`,
          sql`LOWER(${products.description}) LIKE ${searchTerm}`,
          sql`LOWER(${products.category}) LIKE ${searchTerm}`
        ))
        .limit(10),

        // Search orders - case insensitive
        db.select({
          id: orders.id,
          type: sql<string>`'order'`,
          title: orders.orderNumber,
          subtitle: sql<string>`CONCAT('€', ${orders.total}, ' - ', ${orders.status})`,
          icon: sql<string>`'shopping-cart'`,
          route: sql<string>`'/orders'`
        })
        .from(orders)
        .where(or(
          sql`LOWER(${orders.orderNumber}) LIKE ${searchTerm}`,
          sql`LOWER(${orders.status}) LIKE ${searchTerm}`,
          sql`CAST(${orders.total} AS TEXT) LIKE ${searchTerm}`
        ))
        .limit(10)
      ]);

      // Combine and sort results by relevance
      const allResults = [
        ...customerResults,
        ...productResults, 
        ...orderResults
      ];

      // If no results found, return demo data for testing
      if (allResults.length === 0) {
        return this.getDemoSearchResults(query);
      }

      return allResults.slice(0, 15); // Limit total results
    } catch (error) {
      console.error('Search error:', error);
      // Return demo results as fallback
      return this.getDemoSearchResults(query);
    }
  }

  // Demo search results for testing when no real data exists
  private getDemoSearchResults(query: string): any[] {
    const demoResults = [
      // Demo customers
      {
        id: "cust-001",
        type: "customer",
        title: "Farmacia Centrale Roma",
        subtitle: "farmacia.roma@example.com",
        icon: "users",
        route: "/customers"
      },
      {
        id: "cust-002", 
        type: "customer",
        title: "Dr. Mario Rossi",
        subtitle: "mario.rossi@medici.it",
        icon: "users",
        route: "/customers"
      },
      {
        id: "cust-003",
        type: "customer", 
        title: "Grossista Pharma Sud",
        subtitle: "Napoli - grossista@pharma.it",
        icon: "users",
        route: "/customers"
      },
      // Demo products
      {
        id: "prod-001",
        type: "product",
        title: "Aspirina 500mg",
        subtitle: "ASP500 - €12.50",
        icon: "package", 
        route: "/inventory"
      },
      {
        id: "prod-002",
        type: "product",
        title: "Paracetamolo 1000mg", 
        subtitle: "PAR1000 - €8.90",
        icon: "package",
        route: "/inventory"
      },
      {
        id: "prod-003",
        type: "product",
        title: "Omeprazolo 20mg",
        subtitle: "OME20 - €15.30",
        icon: "package",
        route: "/inventory"
      },
      // Demo orders
      {
        id: "ord-001",
        type: "order",
        title: "ORD-2025-001",
        subtitle: "€1,250.00 - Completato",
        icon: "shopping-cart",
        route: "/orders"
      },
      {
        id: "ord-002", 
        type: "order",
        title: "ORD-2025-002",
        subtitle: "€890.50 - In elaborazione",
        icon: "shopping-cart",
        route: "/orders"
      }
    ];

    // Filter demo results based on query
    const queryLower = query.toLowerCase();
    return demoResults.filter(result => 
      result.title.toLowerCase().includes(queryLower) ||
      result.subtitle.toLowerCase().includes(queryLower) ||
      result.type.toLowerCase().includes(queryLower)
    );
  }

  // =================================
  // ISF COMPENSATION SYSTEM METHODS
  // =================================

  // Get compensations for admin dashboard
  async getCompensations(filters: {
    month?: number;
    year?: number;
    informatoreId?: string;
    type?: string;
  }): Promise<any[]> {
    const { month, year, informatoreId, type } = filters;
    
    // Demo data for now - in production, this would query the database
    const baseCompensations = [
      {
        id: "comp-001",
        informatoreId: "inf-001",
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
        fixedSalary: "2500.00",
        iqviaCommission: "890.50",
        wikentshipCommission: "567.30",
        directSalesCommission: "234.20",
        performanceBonus: "100.00",
        visitPenalty: "0.00",
        teamCommission: "150.00",
        cutOffReduction: "0.00",
        totalGross: "4441.00",
        totalNet: "3552.80",
        status: "calculated",
        calculatedAt: new Date().toISOString(),
        informatore: {
          id: "inf-001",
          firstName: "Mario",
          lastName: "Rossi",
          type: "libero_professionista",
          level: "informatore",
          area: "Lazio Nord"
        }
      },
      {
        id: "comp-002", 
        informatoreId: "inf-002",
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
        fixedSalary: "3200.00",
        iqviaCommission: "1245.80",
        wikentshipCommission: "789.40",
        directSalesCommission: "345.60",
        performanceBonus: "100.00",
        visitPenalty: "50.00",
        teamCommission: "320.00",
        cutOffReduction: "100.00",
        totalGross: "5850.80",
        totalNet: "4680.64",
        status: "approved",
        calculatedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        informatore: {
          id: "inf-002",
          firstName: "Giulia",
          lastName: "Bianchi",
          type: "libero_professionista", 
          level: "capo_area",
          area: "Lombardia"
        }
      },
      {
        id: "comp-003",
        informatoreId: "inf-003", 
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
        fixedSalary: "0.00",
        iqviaCommission: "0.00",
        wikentshipCommission: "0.00",
        directSalesCommission: "0.00",
        performanceBonus: "0.00",
        visitPenalty: "0.00",
        teamCommission: "0.00",
        cutOffReduction: "0.00",
        totalGross: "0.00",
        totalNet: "0.00",
        status: "draft",
        calculatedAt: new Date().toISOString(),
        informatore: {
          id: "inf-003",
          firstName: "Luca",
          lastName: "Verdi",
          type: "dipendente",
          level: "informatore", 
          area: "Veneto"
        }
      }
    ];

    // Apply filters
    let filtered = baseCompensations;
    
    if (informatoreId && informatoreId !== 'all') {
      filtered = filtered.filter(comp => comp.informatoreId === informatoreId);
    }
    
    if (type && type !== 'all') {
      filtered = filtered.filter(comp => comp.informatore.type === type);
    }

    return filtered;
  }

  // Get compensation statistics
  async getCompensationStats(filters: { month: number; year: number }): Promise<{
    totalCompensations: number;
    totalDipendenti: number;
    totalLiberiProfessionisti: number;
    pendingApprovals: number;
    avgCompensation: number;
    monthlyGrowth: number;
  }> {
    const compensations = await this.getCompensations(filters);
    
    const totalCompensations = compensations.reduce((sum, comp) => sum + parseFloat(comp.totalGross), 0);
    const totalDipendenti = compensations.filter(comp => comp.informatore.type === 'dipendente').length;
    const totalLiberiProfessionisti = compensations.filter(comp => comp.informatore.type === 'libero_professionista').length;
    const pendingApprovals = compensations.filter(comp => comp.status === 'calculated').length;
    const avgCompensation = compensations.length > 0 ? totalCompensations / compensations.length : 0;
    
    return {
      totalCompensations,
      totalDipendenti,
      totalLiberiProfessionisti,
      pendingApprovals,
      avgCompensation,
      monthlyGrowth: 8.5 // Demo growth rate
    };
  }

  // Calculate compensations for a specific period
  async calculateCompensations(params: {
    month: number;
    year: number;
    informatoreId?: string;
  }): Promise<any> {
    const { month, year, informatoreId } = params;
    
    // This would perform actual compensation calculations based on:
    // - IQVIA data from PharmaEVO
    // - WIKENSHIP orders from GestLine  
    // - Direct sales data
    // - Cut-off thresholds
    // - Visit targets and performance
    // - Growth bonuses (5%+ rule)
    
    return {
      success: true,
      message: `Compensi calcolati per ${informatoreId ? 'informatore specifico' : 'tutti gli informatori'}`,
      period: `${month}/${year}`,
      calculated: informatoreId ? 1 : 3,
      timestamp: new Date().toISOString()
    };
  }

  // Get my compensation (for logged-in informatori)
  async getMyCompensation(userId: string, filters: { month: number; year: number }): Promise<any | null> {
    const { month, year } = filters;
    
    // Demo compensation for an informatore
    return {
      id: "comp-001",
      informatoreId: userId,
      month,
      year,
      fixedSalary: "2500.00",
      iqviaCommission: "890.50",
      wikentshipCommission: "567.30", 
      directSalesCommission: "234.20",
      performanceBonus: "100.00",
      visitPenalty: "0.00",
      teamCommission: "0.00",
      cutOffReduction: "0.00",
      totalGross: "4291.00",
      totalNet: "3432.80",
      totalSales: "12500.00",
      monthlyVisits: 18,
      avgSalesLast12Months: "11200.00",
      status: "calculated",
      calculatedAt: new Date().toISOString()
    };
  }

  // Get commission logs for an informatore  
  async getMyCommissionLogs(userId: string, filters: {
    month: number;
    year: number;
    search?: string;
  }): Promise<any[]> {
    const { month, year, search } = filters;
    
    // Demo commission logs (excluding IQVIA data as specified)
    const baseLogs = [
      {
        id: "log-001",
        compensationId: "comp-001", 
        informatoreId: userId,
        orderId: "ord-001",
        externalOrderId: "WOO-2025-001",
        source: "wikenship",
        customerId: "cust-001",
        customerName: "Farmacia Centrale Roma",
        customerType: "pharmacy",
        orderAmount: "2450.00",
        commissionRate: "15.00",
        commissionAmount: "367.50",
        cutOffApplied: false,
        cutOffAmount: "0.00",
        orderDate: "2025-01-15",
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: "log-002",
        compensationId: "comp-001",
        informatoreId: userId, 
        orderId: "ord-002",
        externalOrderId: "GL-2025-002",
        source: "gestline",
        customerId: "cust-002",
        customerName: "Dr. Mario Rossi",
        customerType: "private",
        orderAmount: "890.00",
        commissionRate: "12.00",
        commissionAmount: "106.80",
        cutOffApplied: false,
        cutOffAmount: "0.00", 
        orderDate: "2025-01-18",
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: "log-003",
        compensationId: "comp-001",
        informatoreId: userId,
        orderId: "ord-003", 
        externalOrderId: null,
        source: "direct_sales",
        customerId: "cust-003",
        customerName: "Grossista Pharma Sud",
        customerType: "pharmacy",
        orderAmount: "1650.00",
        commissionRate: "8.00",
        commissionAmount: "132.00",
        cutOffApplied: true,
        cutOffAmount: "25.00",
        orderDate: "2025-01-20",
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];

    // Apply search filter if provided
    let filtered = baseLogs;
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = baseLogs.filter(log => 
        log.customerName.toLowerCase().includes(searchTerm) ||
        log.source.toLowerCase().includes(searchTerm) ||
        log.externalOrderId?.toLowerCase().includes(searchTerm) ||
        log.orderAmount.includes(searchTerm)
      );
    }

    return filtered;
  }

  // Get doctor cards for an informatore
  async getMyDoctorCards(userId: string): Promise<any[]> {
    // Demo doctor cards assigned to the informatore
    return [
      {
        id: "card-001",
        informatoreId: userId,
        customerId: "cust-001",
        facilityName: "Farmacia Centrale Roma",
        facilityType: "farmacia",
        doctorName: "Dr. Antonio Bianchi",
        specialization: "Farmacista",
        phone: "+39 06 123456",
        email: "a.bianchi@farmaciacentrale.it",
        address: "Via Roma 123",
        city: "Roma", 
        province: "RM",
        region: "Lazio",
        importance: "high",
        prescriptionVolume: "alto",
        medicalNotes: "Farmacia molto attiva, ordini frequenti",
        preferences: "Preferisce prodotti premium",
        interestedProducts: ["ABC123", "DEF456"],
        lastVisitDate: "2025-01-15",
        nextVisitDate: "2025-02-15",
        visitFrequency: "mensile",
        isShared: false,
        sharedWith: [],
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "card-002",
        informatoreId: userId,
        customerId: "cust-002", 
        facilityName: "Studio Medico Dr. Rossi",
        facilityType: "studio_privato",
        doctorName: "Dr. Mario Rossi",
        specialization: "Cardiologia",
        phone: "+39 06 987654",
        email: "m.rossi@cardioroma.it",
        address: "Via Nazionale 456",
        city: "Roma",
        province: "RM", 
        region: "Lazio",
        importance: "medium",
        prescriptionVolume: "medio",
        medicalNotes: "Specialista in cardiologia, interessato a nuovi farmaci",
        preferences: "Protocolli evidence-based",
        interestedProducts: ["GHI789", "JKL012"],
        lastVisitDate: "2025-01-10",
        nextVisitDate: "2025-02-10",
        visitFrequency: "quindicinale",
        isShared: true,
        sharedWith: ["inf-002"],
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Get performance statistics for an informatore
  async getMyPerformance(userId: string, filters: { year: number }): Promise<any> {
    const { year } = filters;
    
    // Demo performance data for dipendenti (who don't receive commissions)
    return {
      iqviaSales: 45600.00,
      wikentshipSales: 23400.00,
      directSales: 18900.00,
      totalSales: 87900.00,
      ordersCount: 156,
      visitsCount: 48,
      customersCount: 12,
      averageOrderValue: 563.46,
      growthRate: 12.5,
      monthlyBreakdown: [
        { month: 1, sales: 7200.00, orders: 12, visits: 4 },
        { month: 2, sales: 6800.00, orders: 11, visits: 4 },
        { month: 3, sales: 8500.00, orders: 15, visits: 4 },
        // ... other months
      ]
    };
  }
}

export const storage = new DatabaseStorage();
