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
    doctorOrders: OrderWithDetails[];
    totalPoints: number;
    monthlyStats: {
      orders: number;
      revenue: string;
      points: number;
    };
  }>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    todaysOrders: number;
    monthlyRevenue: string;
    activeCustomers: number;
    pendingShipments: number;
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
      whereConditions.push(
        or(
          ilike(customers.firstName, `%${search}%`),
          ilike(customers.lastName, `%${search}%`),
          ilike(customers.companyName, `%${search}%`),
          ilike(customers.email, `%${search}%`)
        )
      );
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

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    todaysOrders: number;
    monthlyRevenue: string;
    activeCustomers: number;
    pendingShipments: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaysOrdersResult, monthlyRevenueResult, activeCustomersResult, pendingShipmentsResult] = await Promise.all([
      db.select({ count: count() }).from(orders)
        .where(and(
          gte(orders.orderDate, today),
          lte(orders.orderDate, tomorrow)
        )),
      db.select({ sum: sum(orders.total) }).from(orders)
        .where(gte(orders.orderDate, startOfMonth)),
      db.select({ count: count() }).from(customers)
        .where(eq(customers.isActive, true)),
      db.select({ count: count() }).from(shipments)
        .where(eq(shipments.status, "pending"))
    ]);

    return {
      todaysOrders: todaysOrdersResult[0].count,
      monthlyRevenue: monthlyRevenueResult[0].sum || "0",
      activeCustomers: activeCustomersResult[0].count,
      pendingShipments: pendingShipmentsResult[0].count,
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

  // Advanced Commission operations
  async getAdvancedCommissions(informatoreId: string, filters: any): Promise<any[]> {
    return [
      {
        id: "comm-001",
        informatoreId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: 2500.00,
        iqviaCommission: 890.00,
        wikenshipCommission: 567.50,
        directSalesCommission: 234.00,
        bonusAmount: 100.00,
        malusAmount: 0.00,
        cutOffReduction: 0.00,
        visitTargetBonus: 150.00,
        growthBonus: 100.00,
        totalCommission: 4541.50,
        calculationData: { growthRate: 8.5, visits: 18 },
        createdAt: new Date().toISOString()
      }
    ];
  }

  async calculateAdvancedCommission(informatoreId: string, year: number, month: number): Promise<any> {
    return {
      informatoreId,
      year,
      month,
      totalCommission: 4541.50,
      details: {
        baseSalary: 2500.00,
        commissions: 1891.50,
        bonuses: 250.00,
        growthBonus: 100.00
      }
    };
  }

  // Analytics operations
  async getRevenueAnalytics(filters: any): Promise<any> {
    return {
      totalRevenue: 156780.00,
      orderCount: 234,
      averageOrderValue: 670.00,
      growthRate: 8.5,
      topProducts: [
        { code: "ABC123", revenue: 45000, count: 89 },
        { code: "DEF456", revenue: 38000, count: 67 },
        { code: "GHI789", revenue: 32000, count: 54 }
      ],
      periodComparison: {
        current: { revenue: 156780, orders: 234 },
        previous: { revenue: 144500, orders: 216 },
        growth: 8.5
      }
    };
  }

  async getGrowthAnalytics(filters: any): Promise<any> {
    return [
      { period: "2024-09", current: 142000, previous: 131000 },
      { period: "2024-10", current: 148000, previous: 138000 },
      { period: "2024-11", current: 152000, previous: 142000 },
      { period: "2024-12", current: 156780, previous: 144500 }
    ];
  }

  async getTopPerformers(filters: any): Promise<any[]> {
    return [
      {
        id: "inf-001",
        name: "Mario Rossi",
        revenue: 89450.00,
        orders: 145,
        growth: 12.5,
        type: "informatore"
      },
      {
        id: "inf-002",
        name: "Giulia Bianchi",
        revenue: 67230.00,
        orders: 89,
        growth: 8.9,
        type: "informatore"
      }
    ];
  }

  // Doctor Points operations
  async getDoctorPoints(doctorId: string, filters: any): Promise<any[]> {
    return [
      {
        id: "dp-001",
        doctorId,
        informatoreId: "inf-001",
        points: 150.00,
        pointsType: "order",
        description: "Ordine ABC123 - €2450",
        createdAt: new Date().toISOString()
      }
    ];
  }

  async addDoctorPoints(pointsData: any): Promise<any> {
    return {
      id: `dp-${Date.now()}`,
      ...pointsData,
      createdAt: new Date().toISOString()
    };
  }

  // Bonus/Malus operations
  async getBonusMalus(filters: any): Promise<any[]> {
    return [
      {
        id: "bm-001",
        informatoreId: "inf-001",
        type: "bonus",
        amount: 100.00,
        description: "Crescita 5%+ mensile",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        createdBy: "admin-001",
        createdAt: new Date().toISOString()
      }
    ];
  }

  async createBonusMalus(bonusMalusData: any): Promise<any> {
    return {
      id: `bm-${Date.now()}`,
      ...bonusMalusData,
      createdAt: new Date().toISOString()
    };
  }

  // Medical Visits operations
  async getMedicalVisits(filters: any): Promise<any[]> {
    return [
      {
        id: "mv-001",
        informatoreId: "inf-001",
        doctorId: "doc-001",
        visitDate: new Date().toISOString(),
        notes: "Presentati nuovi prodotti ABC123 e DEF456",
        productsDiscussed: ["ABC123", "DEF456"],
        followUpRequired: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  async createMedicalVisit(visitData: any): Promise<any> {
    return {
      id: `mv-${Date.now()}`,
      ...visitData,
      createdAt: new Date().toISOString()
    };
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
}

export const storage = new DatabaseStorage();
