import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Express sessions
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User authentication table - Custom Auth System
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // hashed password
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin, manager
  userType: varchar("user_type").notNull().default("standard"), // standard, informatore
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer types: private, pharmacy only (removed doctor, wholesaler)
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // "private" | "pharmacy"
  name: varchar("name").notNull(), // Full name for private, company name for pharmacy
  firstName: varchar("first_name"), // For private customers
  lastName: varchar("last_name"), // For private customers
  owner: varchar("owner"), // For pharmacies - owner name
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  province: varchar("province"),
  partitaIva: varchar("partita_iva"), // For pharmacies
  fiscalCode: varchar("fiscal_code"),
  specialization: varchar("specialization"), // For pharmacies
  
  // Order statistics (calculated/cached values)
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastOrderDate: timestamp("last_order_date"),
  
  // Status and metadata
  status: varchar("status").default("active"), // "active" | "inactive" | "premium"
  loyaltyPoints: integer("loyalty_points").default(0),
  informatoreId: varchar("informatore_id").references(() => informatori.id),
  isActive: boolean("is_active").default(true),
  registrationDate: timestamp("registration_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").unique().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  customerId: varchar("customer_id").references(() => customers.id),
  customerType: varchar("customer_type").notNull(), // private, pharmacy, wholesale
  status: varchar("status").default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  orderDate: timestamp("order_date").defaultNow(),
  shippingDate: timestamp("shipping_date"),
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  productId: varchar("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shipments
export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  trackingNumber: varchar("tracking_number"),
  carrier: varchar("carrier"), // GLS, Bartolini, etc.
  status: varchar("status").default("pending"), // pending, shipped, in_transit, delivered
  shippingDate: timestamp("shipping_date"),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commissions for ISF
export const commissions = pgTable("commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  customerId: varchar("customer_id").references(() => customers.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  status: varchar("status").default("pending"), // pending, paid
  calculatedAt: timestamp("calculated_at").defaultNow(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System integrations status
export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").unique().notNull(), // gestline, odoo, gls, pharmaevo, ebay
  status: varchar("status").default("offline"), // online, offline, error, warning
  lastSync: timestamp("last_sync"),
  configuration: jsonb("configuration"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Informatori (Medical Representatives) - Extended for compensation system
export const informatori = pgTable("informatori", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  
  // Tipo contratto e livello
  type: varchar("type").notNull().default("dipendente"), // 'dipendente' | 'libero_professionista'
  level: varchar("level").notNull().default("informatore"), // 'informatore' | 'capo_area'
  
  // Configurazione economica per liberi professionisti
  fixedMonthlySalary: decimal("fixed_monthly_salary", { precision: 10, scale: 2 }).default("0"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0"),
  cutOffThreshold: decimal("cut_off_threshold", { precision: 10, scale: 2 }).default("0"),
  monthlyVisitTarget: integer("monthly_visit_target").default(0),
  
  // Territorio e gerarchia
  area: varchar("area"), // Area geografica di competenza
  supervisorId: varchar("supervisor_id"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compensi mensili ISF
export const isfCompensations = pgTable("isf_compensations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  
  // Periodo
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  
  // Compensi base
  fixedSalary: decimal("fixed_salary", { precision: 10, scale: 2 }).default("0"),
  
  // Provvigioni da fonti diverse
  iqviaCommission: decimal("iqvia_commission", { precision: 10, scale: 2 }).default("0"), // Da PharmaEVO/IQVIA
  wikentshipCommission: decimal("wikenship_commission", { precision: 10, scale: 2 }).default("0"), // Da WIKENSHIP/GestLine
  directSalesCommission: decimal("direct_sales_commission", { precision: 10, scale: 2 }).default("0"), // Vendite dirette
  
  // Bonus e penalità
  performanceBonus: decimal("performance_bonus", { precision: 10, scale: 2 }).default("0"), // 100€ per +5% crescita
  visitPenalty: decimal("visit_penalty", { precision: 10, scale: 2 }).default("0"), // Penalità mancate visite
  teamCommission: decimal("team_commission", { precision: 10, scale: 2 }).default("0"), // Provvigioni Capo Area
  
  // Cut-off applicati
  cutOffReduction: decimal("cut_off_reduction", { precision: 10, scale: 2 }).default("0"),
  
  // Totali
  totalGross: decimal("total_gross", { precision: 10, scale: 2 }).notNull(),
  totalNet: decimal("total_net", { precision: 10, scale: 2 }).notNull(),
  
  // Metriche performance
  totalSales: decimal("total_sales", { precision: 10, scale: 2 }).default("0"),
  monthlyVisits: integer("monthly_visits").default(0),
  avgSalesLast12Months: decimal("avg_sales_last_12_months", { precision: 10, scale: 2 }).default("0"),
  
  // Stato calcolo
  status: varchar("status").notNull().default("calculated"), // draft, calculated, approved, paid
  calculatedAt: timestamp("calculated_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Log dettagliato provvigioni per ordine (visibile agli ISF)
export const commissionLogs = pgTable("commission_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  compensationId: varchar("compensation_id").references(() => isfCompensations.id),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  
  // Riferimenti ordini
  orderId: varchar("order_id").references(() => orders.id),
  externalOrderId: varchar("external_order_id"), // ID esterno da WIKENSHIP/PharmaEVO
  source: varchar("source").notNull(), // 'wikenship', 'gestline', 'direct_sales', 'iqvia'
  
  // Dettagli cliente
  customerId: varchar("customer_id").references(() => customers.id),
  customerName: varchar("customer_name"),
  customerType: varchar("customer_type"), // 'pharmacy', 'private'
  
  // Calcolo provvigione
  orderAmount: decimal("order_amount", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  cutOffApplied: boolean("cut_off_applied").default(false),
  cutOffAmount: decimal("cut_off_amount", { precision: 10, scale: 2 }).default("0"),
  
  // Date
  orderDate: date("order_date").notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schede medico/farmacia per ISF (sola lettura per ISF, modificabili solo da admin)
export const doctorCards = pgTable("doctor_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  
  // Informazioni struttura
  facilityName: varchar("facility_name"),
  facilityType: varchar("facility_type"), // 'ospedale', 'clinica', 'farmacia', 'studio_privato'
  doctorName: varchar("doctor_name"),
  specialization: varchar("specialization"),
  
  // Contatti
  phone: varchar("phone"),
  email: varchar("email"),
  
  // Localizzazione
  address: text("address"),
  city: varchar("city"),
  province: varchar("province"),
  region: varchar("region"),
  
  // Classificazione
  importance: varchar("importance").default("medium"), // 'high', 'medium', 'low'
  prescriptionVolume: varchar("prescription_volume"), // 'alto', 'medio', 'basso'
  
  // Note mediche (solo admin può modificare)
  medicalNotes: text("medical_notes"),
  preferences: text("preferences"),
  interestedProducts: text("interested_products").array(),
  
  // Pianificazione visite
  lastVisitDate: date("last_visit_date"),
  nextVisitDate: date("next_visit_date"),
  visitFrequency: varchar("visit_frequency"), // 'settimanale', 'quindicinale', 'mensile'
  
  // Condivisione
  isShared: boolean("is_shared").default(false), // Se condivisa con altri ISF
  sharedWith: text("shared_with").array(), // Array di ID informatori
  
  // Status
  status: varchar("status").default("active"), // 'active', 'inactive', 'potential'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action").notNull(),
  entityType: varchar("entity_type"), // order, customer, product, etc.
  entityId: varchar("entity_id"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const customersRelations = relations(customers, ({ one, many }) => ({
  orders: many(orders),
  commissions: many(commissions),
  informatore: one(informatori, {
    fields: [customers.informatoreId],
    references: [informatori.id],
  }),
}));

export const informatoriRelations = relations(informatori, ({ many }) => ({
  customers: many(customers),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  shipment: one(shipments),
  commission: one(commissions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  order: one(orders, {
    fields: [commissions.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [commissions.customerId],
    references: [customers.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertInformatoreSchema = createInsertSchema(informatori).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIsfCompensationSchema = createInsertSchema(isfCompensations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  calculatedAt: true,
  approvedAt: true,
});

export const insertCommissionLogSchema = createInsertSchema(commissionLogs).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertDoctorCardSchema = createInsertSchema(doctorCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  lastLogin: true
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username deve essere almeno 3 caratteri"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri"),
  userType: z.enum(["standard", "informatore"]).default("standard"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type Informatore = typeof informatori.$inferSelect;
export type InsertInformatore = z.infer<typeof insertInformatoreSchema>;
export type IsfCompensation = typeof isfCompensations.$inferSelect;
export type InsertIsfCompensation = z.infer<typeof insertIsfCompensationSchema>;
export type CommissionLog = typeof commissionLogs.$inferSelect;
export type InsertCommissionLog = z.infer<typeof insertCommissionLogSchema>;
export type DoctorCard = typeof doctorCards.$inferSelect;
export type InsertDoctorCard = z.infer<typeof insertDoctorCardSchema>;

// WIKENSHIP frontier table for GestLine integration
export const wikenshipOrders = pgTable("wikenship_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().unique(),
  source: varchar("source", { enum: ["woocommerce", "ebay", "direct"] }).notNull(),
  customerId: varchar("customer_id").references(() => customers.id),
  informatoreId: varchar("informatore_id").references(() => informatori.id),
  doctorId: varchar("doctor_id").references(() => customers.id),
  totalAmount: decimal("total_amount").notNull(),
  netAmount: decimal("net_amount").notNull(),
  vatAmount: decimal("vat_amount").notNull(),
  commissionAmount: decimal("commission_amount"),
  gestlineStatus: varchar("gestline_status", { enum: ["pending", "sent", "processed", "error"] }).default("pending"),
  odooStatus: varchar("odoo_status", { enum: ["pending", "sent", "processed", "error"] }).default("pending"),
  alertGenerated: boolean("alert_generated").default(false),
  orderData: jsonb("order_data"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Doctor point system for commissions
export const doctorPoints = pgTable("doctor_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").references(() => customers.id).notNull(),
  informatoreId: varchar("informatore_id").references(() => informatori.id),
  orderId: varchar("order_id").references(() => wikenshipOrders.id),
  points: decimal("points").notNull(),
  pointsType: varchar("points_type", { enum: ["order", "bonus", "malus", "visit"] }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// PharmaEVO integration for pharmacy orders
export const pharmaevoOrders = pgTable("pharmaevo_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().unique(),
  pharmacyId: varchar("pharmacy_id").references(() => customers.id),
  totalAmount: decimal("total_amount").notNull(),
  iqviaData: jsonb("iqvia_data"),
  gestlineStatus: varchar("gestline_status", { enum: ["pending", "sent", "processed", "error"] }).default("pending"),
  odooStatus: varchar("odoo_status", { enum: ["pending", "sent", "processed", "error"] }).default("pending"),
  odooTags: varchar("odoo_tags").array().default(sql`ARRAY['Farm']`),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Advanced commission calculations for informatori
export const advancedCommissions = pgTable("advanced_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  baseSalary: decimal("base_salary"),
  iqviaCommission: decimal("iqvia_commission"),
  wikenshipCommission: decimal("wikenship_commission"),
  directSalesCommission: decimal("direct_sales_commission"),
  bonusAmount: decimal("bonus_amount"),
  malusAmount: decimal("malus_amount"),
  cutOffReduction: decimal("cut_off_reduction"),
  visitTargetBonus: decimal("visit_target_bonus"),
  growthBonus: decimal("growth_bonus"), // 100€ for 5%+ growth
  capoAreaCommission: decimal("capo_area_commission"),
  totalCommission: decimal("total_commission").notNull(),
  calculationData: jsonb("calculation_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics data for advanced reporting
export const analyticsData = pgTable("analytics_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id),
  doctorId: varchar("doctor_id").references(() => customers.id),
  productCode: varchar("product_code"),
  period: varchar("period").notNull(), // YYYY-MM format
  revenue: decimal("revenue").notNull(),
  orderCount: integer("order_count").notNull(),
  growthRate: decimal("growth_rate"), // Percentage growth
  dataSource: varchar("data_source", { enum: ["wikenship", "pharmaevo", "gestline", "iqvia"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bonus/Malus management for admins
export const bonusMalus = pgTable("bonus_malus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  type: varchar("type", { enum: ["bonus", "malus"] }).notNull(),
  amount: decimal("amount").notNull(),
  description: text("description").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical visit tracking for ISF performance
export const medicalVisits = pgTable("medical_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  informatoreId: varchar("informatore_id").references(() => informatori.id).notNull(),
  doctorId: varchar("doctor_id").references(() => customers.id).notNull(),
  visitDate: timestamp("visit_date").notNull(),
  notes: text("notes"),
  productsDiscussed: varchar("products_discussed").array(),
  followUpRequired: boolean("follow_up_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users table is already defined above with role management

// New insert schemas and types
export const insertWikenshipOrderSchema = createInsertSchema(wikenshipOrders).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertAdvancedCommissionSchema = createInsertSchema(advancedCommissions).omit({
  id: true,
  createdAt: true,
});

export const insertBonusMalusSchema = createInsertSchema(bonusMalus).omit({
  id: true,
  createdAt: true,
});

// Extended types
export type WikenshipOrder = typeof wikenshipOrders.$inferSelect;
export type InsertWikenshipOrder = z.infer<typeof insertWikenshipOrderSchema>;
export type AdvancedCommission = typeof advancedCommissions.$inferSelect;
export type InsertAdvancedCommission = z.infer<typeof insertAdvancedCommissionSchema>;
export type BonusMalus = typeof bonusMalus.$inferSelect;
export type InsertBonusMalus = z.infer<typeof insertBonusMalusSchema>;
export type DoctorPoints = typeof doctorPoints.$inferSelect;
export type PharmaevoOrder = typeof pharmaevoOrders.$inferSelect;
export type AnalyticsData = typeof analyticsData.$inferSelect;
export type MedicalVisit = typeof medicalVisits.$inferSelect;

// Order with relations
export type OrderWithDetails = Order & {
  customer?: Customer;
  items?: (OrderItem & { product?: Product })[];
  shipment?: Shipment;
  commission?: Commission;
};

// Advanced order analytics
export type OrderAnalytics = {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  growthRate: number;
  topProducts: Array<{ code: string; revenue: number; count: number }>;
  periodComparison: {
    current: { revenue: number; orders: number };
    previous: { revenue: number; orders: number };
    growth: number;
  };
};
