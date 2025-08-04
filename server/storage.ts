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
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithDetails,
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
import { eq, desc, count, sum, and, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
}

export const storage = new DatabaseStorage();
