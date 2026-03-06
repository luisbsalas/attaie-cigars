import { db } from "./db";
import {
  products,
  adminUsers,
  customers,
  orders,
  orderItems,
  promoCodes,
  newsletterSubscribers,
  productReviews,
  activityLogs,
  storeSettings,
  emailTemplates,
  homepageBanners,
  announcementBar,
  adminNotifications,
  shipments,
  type Product,
  type InsertProduct,
  type AdminUser,
  type InsertAdminUser,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type PromoCode,
  type InsertPromoCode,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type ProductReview,
  type InsertProductReview,
  type ActivityLog,
  type InsertActivityLog,
  type StoreSetting,
  type InsertStoreSetting,
  type EmailTemplate,
  type InsertEmailTemplate,
  type HomepageBanner,
  type InsertHomepageBanner,
  type AnnouncementBar,
  type InsertAnnouncementBar,
  type AdminNotification,
  type InsertAdminNotification,
  type Shipment,
  type InsertShipment,
} from "@shared/schema";
import { eq, desc, asc, sql, and, gte, lte, like, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Products
  getProducts(category?: string, featured?: boolean): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Admin Users
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUsers(): Promise<AdminUser[]>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, user: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  deleteAdminUser(id: number): Promise<boolean>;
  updateAdminLastLogin(id: number): Promise<void>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  
  // Orders
  getOrders(status?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  getAllOrderItems(): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  
  // Promo Codes
  getPromoCodes(): Promise<PromoCode[]>;
  getPromoCode(id: number): Promise<PromoCode | undefined>;
  getPromoCodeByCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promo: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, promo: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<boolean>;
  
  // Newsletter
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  updateNewsletterSubscriber(id: number, subscriber: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined>;
  
  // Reviews
  getProductReviews(productId?: number): Promise<ProductReview[]>;
  getPendingReviews(): Promise<ProductReview[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;
  updateProductReview(id: number, review: Partial<ProductReview>): Promise<ProductReview | undefined>;
  deleteProductReview(id: number): Promise<boolean>;
  
  // Activity Logs
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Store Settings
  getStoreSetting(key: string): Promise<StoreSetting | undefined>;
  getAllStoreSettings(): Promise<StoreSetting[]>;
  upsertStoreSetting(setting: InsertStoreSetting): Promise<StoreSetting>;
  
  // Email Templates
  getEmailTemplates(): Promise<EmailTemplate[]>;
  getEmailTemplate(name: string): Promise<EmailTemplate | undefined>;
  upsertEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  
  // Banners
  getHomepageBanners(): Promise<HomepageBanner[]>;
  createHomepageBanner(banner: InsertHomepageBanner): Promise<HomepageBanner>;
  updateHomepageBanner(id: number, banner: Partial<InsertHomepageBanner>): Promise<HomepageBanner | undefined>;
  deleteHomepageBanner(id: number): Promise<boolean>;
  
  // Announcement Bar
  getAnnouncementBar(): Promise<AnnouncementBar | undefined>;
  upsertAnnouncementBar(bar: InsertAnnouncementBar): Promise<AnnouncementBar>;
  
  // Admin Notifications
  getAdminNotifications(unreadOnly?: boolean): Promise<AdminNotification[]>;
  createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification>;
  markNotificationRead(id: number): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    totalCustomers: number;
    lowStockCount: number;
  }>;

  // Shipments
  getShipments(orderId?: number): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByOrderId(orderId: number): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<InsertShipment>): Promise<Shipment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(category?: string, featured?: boolean): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (category) {
      query = query.where(eq(products.category, category)) as any;
    }
    
    if (featured) {
      query = query.where(eq(products.featured, true)) as any;
    }

    return await query.orderBy(desc(products.id));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(update).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(products).where(
      sql`${products.stock} <= ${products.lowStockThreshold}`
    );
  }

  // Admin Users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(asc(adminUsers.username));
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(user.passwordHash, 10);
    const [created] = await db.insert(adminUsers).values({ ...user, passwordHash: hashedPassword }).returning();
    return created;
  }

  async updateAdminUser(id: number, update: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    if (update.passwordHash) {
      update.passwordHash = await bcrypt.hash(update.passwordHash, 10);
    }
    const [user] = await db.update(adminUsers).set(update).where(eq(adminUsers.id, id)).returning();
    return user;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
    return true;
  }

  async updateAdminLastLogin(id: number): Promise<void> {
    await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, id));
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [created] = await db.insert(customers).values(customer).returning();
    return created;
  }

  async updateCustomer(id: number, update: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [customer] = await db.update(customers).set(update).where(eq(customers.id, id)).returning();
    return customer;
  }

  // Orders
  async getOrders(status?: string): Promise<Order[]> {
    if (status) {
      return await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async updateOrder(id: number, update: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ ...update, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    return await db.select().from(orderItems);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(item).returning();
    return created;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  // Promo Codes
  async getPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
  }

  async getPromoCode(id: number): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    return promo;
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, code.toUpperCase()));
    return promo;
  }

  async createPromoCode(promo: InsertPromoCode): Promise<PromoCode> {
    const [created] = await db.insert(promoCodes).values({ ...promo, code: promo.code.toUpperCase() }).returning();
    return created;
  }

  async updatePromoCode(id: number, update: Partial<InsertPromoCode>): Promise<PromoCode | undefined> {
    if (update.code) update.code = update.code.toUpperCase();
    const [promo] = await db.update(promoCodes).set(update).where(eq(promoCodes.id, id)).returning();
    return promo;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
    return true;
  }

  // Newsletter
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [created] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return created;
  }

  async updateNewsletterSubscriber(id: number, update: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.update(newsletterSubscribers).set(update).where(eq(newsletterSubscribers.id, id)).returning();
    return subscriber;
  }

  // Reviews
  async getProductReviews(productId?: number): Promise<ProductReview[]> {
    if (productId) {
      return await db.select().from(productReviews).where(eq(productReviews.productId, productId)).orderBy(desc(productReviews.createdAt));
    }
    return await db.select().from(productReviews).orderBy(desc(productReviews.createdAt));
  }

  async getPendingReviews(): Promise<ProductReview[]> {
    return await db.select().from(productReviews).where(eq(productReviews.isApproved, false)).orderBy(desc(productReviews.createdAt));
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [created] = await db.insert(productReviews).values(review).returning();
    return created;
  }

  async updateProductReview(id: number, update: Partial<ProductReview>): Promise<ProductReview | undefined> {
    const [review] = await db.update(productReviews).set(update).where(eq(productReviews.id, id)).returning();
    return review;
  }

  async deleteProductReview(id: number): Promise<boolean> {
    await db.delete(productReviews).where(eq(productReviews.id, id));
    return true;
  }

  // Activity Logs
  async getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [created] = await db.insert(activityLogs).values(log).returning();
    return created;
  }

  // Store Settings
  async getStoreSetting(key: string): Promise<StoreSetting | undefined> {
    const [setting] = await db.select().from(storeSettings).where(eq(storeSettings.key, key));
    return setting;
  }

  async getAllStoreSettings(): Promise<StoreSetting[]> {
    return await db.select().from(storeSettings);
  }

  async upsertStoreSetting(setting: InsertStoreSetting): Promise<StoreSetting> {
    const existing = await this.getStoreSetting(setting.key);
    if (existing) {
      const [updated] = await db.update(storeSettings).set({ value: setting.value, updatedAt: new Date() }).where(eq(storeSettings.key, setting.key)).returning();
      return updated;
    }
    const [created] = await db.insert(storeSettings).values(setting).returning();
    return created;
  }

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates);
  }

  async getEmailTemplate(name: string): Promise<EmailTemplate | undefined> {
    const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.name, name));
    return template;
  }

  async upsertEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const existing = await this.getEmailTemplate(template.name);
    if (existing) {
      const [updated] = await db.update(emailTemplates).set({ ...template, updatedAt: new Date() }).where(eq(emailTemplates.name, template.name)).returning();
      return updated;
    }
    const [created] = await db.insert(emailTemplates).values(template).returning();
    return created;
  }

  // Banners
  async getHomepageBanners(): Promise<HomepageBanner[]> {
    return await db.select().from(homepageBanners).orderBy(asc(homepageBanners.displayOrder));
  }

  async createHomepageBanner(banner: InsertHomepageBanner): Promise<HomepageBanner> {
    const [created] = await db.insert(homepageBanners).values(banner).returning();
    return created;
  }

  async updateHomepageBanner(id: number, update: Partial<InsertHomepageBanner>): Promise<HomepageBanner | undefined> {
    const [banner] = await db.update(homepageBanners).set(update).where(eq(homepageBanners.id, id)).returning();
    return banner;
  }

  async deleteHomepageBanner(id: number): Promise<boolean> {
    await db.delete(homepageBanners).where(eq(homepageBanners.id, id));
    return true;
  }

  // Announcement Bar
  async getAnnouncementBar(): Promise<AnnouncementBar | undefined> {
    const [bar] = await db.select().from(announcementBar).limit(1);
    return bar;
  }

  async upsertAnnouncementBar(bar: InsertAnnouncementBar): Promise<AnnouncementBar> {
    const existing = await this.getAnnouncementBar();
    if (existing) {
      const [updated] = await db.update(announcementBar).set({ ...bar, updatedAt: new Date() }).where(eq(announcementBar.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(announcementBar).values(bar).returning();
    return created;
  }

  // Admin Notifications
  async getAdminNotifications(unreadOnly: boolean = false): Promise<AdminNotification[]> {
    if (unreadOnly) {
      return await db.select().from(adminNotifications).where(eq(adminNotifications.isRead, false)).orderBy(desc(adminNotifications.createdAt));
    }
    return await db.select().from(adminNotifications).orderBy(desc(adminNotifications.createdAt)).limit(50);
  }

  async createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification> {
    const [created] = await db.insert(adminNotifications).values(notification).returning();
    return created;
  }

  async markNotificationRead(id: number): Promise<void> {
    await db.update(adminNotifications).set({ isRead: true }).where(eq(adminNotifications.id, id));
  }

  async markAllNotificationsRead(): Promise<void> {
    await db.update(adminNotifications).set({ isRead: true });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    totalCustomers: number;
    lowStockCount: number;
  }> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const allOrders = await db.select().from(orders);
    const allCustomers = await db.select().from(customers);
    const lowStockProducts = await this.getLowStockProducts();

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const todayRevenue = allOrders.filter(o => o.createdAt && o.createdAt >= todayStart).reduce((sum, o) => sum + Number(o.total), 0);
    const weekRevenue = allOrders.filter(o => o.createdAt && o.createdAt >= weekStart).reduce((sum, o) => sum + Number(o.total), 0);
    const monthRevenue = allOrders.filter(o => o.createdAt && o.createdAt >= monthStart).reduce((sum, o) => sum + Number(o.total), 0);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalCustomers: allCustomers.length,
      lowStockCount: lowStockProducts.length,
    };
  }

  // Shipments
  async getShipments(orderId?: number): Promise<Shipment[]> {
    if (orderId) {
      return await db.select().from(shipments).where(eq(shipments.orderId, orderId)).orderBy(desc(shipments.createdAt));
    }
    return await db.select().from(shipments).orderBy(desc(shipments.createdAt));
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByOrderId(orderId: number): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.orderId, orderId));
    return shipment;
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const [created] = await db.insert(shipments).values(shipment).returning();
    return created;
  }

  async updateShipment(id: number, update: Partial<InsertShipment>): Promise<Shipment | undefined> {
    const [updated] = await db.update(shipments).set(update).where(eq(shipments.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
