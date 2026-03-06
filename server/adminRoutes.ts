import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    adminUser?: {
      id: number;
      username: string;
      role: string;
    };
  }
}

// Middleware to check admin authentication
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.adminUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Middleware to check admin role
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.adminUser || !roles.includes(req.session.adminUser.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export async function registerAdminRoutes(app: Express): Promise<void> {
  // Auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateAdminLastLogin(user.id);
      await storage.createActivityLog({
        adminUserId: user.id,
        adminUsername: user.username,
        action: "login",
        details: "Admin logged in",
      });

      req.session.adminUser = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session?.adminUser) {
      res.json({ authenticated: true, user: req.session.adminUser });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Dashboard stats
  app.get("/api/admin/dashboard/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Low stock products
  app.get("/api/admin/products/low-stock", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock products" });
    }
  });

  // Revenue trends chart data
  app.get("/api/admin/dashboard/revenue-trends", requireAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const allOrders = await storage.getOrders();
      const now = new Date();
      
      const trends: { date: string; revenue: number; orders: number }[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = allOrders.filter(o => {
          if (!o.createdAt) return false;
          const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr;
        });
        
        trends.push({
          date: dateStr,
          revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
          orders: dayOrders.length,
        });
      }
      
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue trends" });
    }
  });

  // Top selling products chart data
  app.get("/api/admin/dashboard/top-products", requireAdmin, async (req, res) => {
    try {
      const orderItems = await storage.getAllOrderItems();
      const products = await storage.getProducts();
      
      const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
      
      for (const item of orderItems) {
        const productId = item.productId;
        if (!productSales[productId]) {
          const product = products.find(p => p.id === productId);
          productSales[productId] = {
            name: product?.name || `Product ${productId}`,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += Number(item.price) * item.quantity;
      }
      
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top products" });
    }
  });

  // Products CRUD
  app.get("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "create_product",
        entityType: "product",
        entityId: product.id,
        details: `Created product: ${product.name}`,
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(Number(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "update_product",
        entityType: "product",
        entityId: product.id,
        details: `Updated product: ${product.name}`,
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      await storage.deleteProduct(Number(req.params.id));
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "delete_product",
        entityType: "product",
        entityId: Number(req.params.id),
        details: `Deleted product: ${product?.name}`,
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const orders = await storage.getOrders(status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const items = await storage.getOrderItems(order.id);
      const customer = await storage.getCustomer(order.customerId);
      res.json({ ...order, items, customer });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.updateOrder(Number(req.params.id), req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "update_order",
        entityType: "order",
        entityId: order.id,
        details: `Updated order ${order.orderNumber}: ${JSON.stringify(req.body)}`,
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.post("/api/admin/orders/:id/fulfill", requireAdmin, async (req, res) => {
    try {
      const { trackingNumber } = req.body;
      const order = await storage.updateOrder(Number(req.params.id), {
        status: "shipped",
        trackingNumber,
        shippedAt: new Date(),
      });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "fulfill_order",
        entityType: "order",
        entityId: order.id,
        details: `Fulfilled order ${order.orderNumber} with tracking: ${trackingNumber}`,
      });
      await storage.createAdminNotification({
        type: "order_shipped",
        title: "Order Shipped",
        message: `Order ${order.orderNumber} has been shipped`,
        entityType: "order",
        entityId: order.id,
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fulfill order" });
    }
  });

  // Customers
  app.get("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/admin/customers/:id", requireAdmin, async (req, res) => {
    try {
      const customer = await storage.getCustomer(Number(req.params.id));
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      const orders = await storage.getOrdersByCustomer(customer.id);
      res.json({ ...customer, orders });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // Promo Codes
  app.get("/api/admin/promo-codes", requireAdmin, async (req, res) => {
    try {
      const promoCodes = await storage.getPromoCodes();
      res.json(promoCodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promo codes" });
    }
  });

  app.post("/api/admin/promo-codes", requireAdmin, async (req, res) => {
    try {
      const promo = await storage.createPromoCode(req.body);
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "create_promo",
        entityType: "promo",
        entityId: promo.id,
        details: `Created promo code: ${promo.code}`,
      });
      res.json(promo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create promo code" });
    }
  });

  app.put("/api/admin/promo-codes/:id", requireAdmin, async (req, res) => {
    try {
      const promo = await storage.updatePromoCode(Number(req.params.id), req.body);
      if (!promo) {
        return res.status(404).json({ error: "Promo code not found" });
      }
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "update_promo",
        entityType: "promo",
        entityId: promo.id,
        details: `Updated promo code: ${promo.code}`,
      });
      res.json(promo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update promo code" });
    }
  });

  app.delete("/api/admin/promo-codes/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePromoCode(Number(req.params.id));
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "delete_promo",
        entityType: "promo",
        entityId: Number(req.params.id),
        details: `Deleted promo code`,
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete promo code" });
    }
  });

  // Newsletter Subscribers
  app.get("/api/admin/newsletter", requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // Product Reviews
  app.get("/api/admin/reviews", requireAdmin, async (req, res) => {
    try {
      const reviews = await storage.getProductReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/admin/reviews/pending", requireAdmin, async (req, res) => {
    try {
      const reviews = await storage.getPendingReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending reviews" });
    }
  });

  app.put("/api/admin/reviews/:id/approve", requireAdmin, async (req, res) => {
    try {
      const review = await storage.updateProductReview(Number(req.params.id), { isApproved: true });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  app.delete("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProductReview(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Activity Logs
  app.get("/api/admin/activity-logs", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  // Store Settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllStoreSettings();
      const settingsMap: Record<string, string | null> = {};
      settings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const updates = req.body;
      for (const [key, value] of Object.entries(updates)) {
        await storage.upsertStoreSetting({ key, value: value as string });
      }
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "update_settings",
        details: `Updated store settings`,
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Email Templates
  app.get("/api/admin/email-templates", requireAdmin, async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  app.put("/api/admin/email-templates/:name", requireAdmin, async (req, res) => {
    try {
      const template = await storage.upsertEmailTemplate({ name: req.params.name, ...req.body });
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update email template" });
    }
  });

  // Homepage Banners
  app.get("/api/admin/banners", requireAdmin, async (req, res) => {
    try {
      const banners = await storage.getHomepageBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", requireAdmin, async (req, res) => {
    try {
      const banner = await storage.createHomepageBanner(req.body);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", requireAdmin, async (req, res) => {
    try {
      const banner = await storage.updateHomepageBanner(Number(req.params.id), req.body);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to update banner" });
    }
  });

  app.delete("/api/admin/banners/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteHomepageBanner(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete banner" });
    }
  });

  // Announcement Bar
  app.get("/api/admin/announcement", requireAdmin, async (req, res) => {
    try {
      const bar = await storage.getAnnouncementBar();
      res.json(bar || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcement bar" });
    }
  });

  app.post("/api/admin/announcement", requireAdmin, async (req, res) => {
    try {
      const bar = await storage.upsertAnnouncementBar(req.body);
      res.json(bar);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement bar" });
    }
  });

  // Admin Notifications
  app.get("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const unreadOnly = req.query.unread === "true";
      const notifications = await storage.getAdminNotifications(unreadOnly);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/admin/notifications/:id/read", requireAdmin, async (req, res) => {
    try {
      await storage.markNotificationRead(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.post("/api/admin/notifications/read-all", requireAdmin, async (req, res) => {
    try {
      await storage.markAllNotificationsRead();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // Admin Users Management
  app.get("/api/admin/users", requireAdmin, requireRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getAdminUsers();
      res.json(users.map((u) => ({ ...u, passwordHash: undefined })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", requireAdmin, requireRole(["admin"]), async (req, res) => {
    try {
      const { username, password, email, role } = req.body;
      const user = await storage.createAdminUser({
        username,
        passwordHash: password,
        email,
        role,
      });
      await storage.createActivityLog({
        adminUserId: req.session.adminUser?.id,
        adminUsername: req.session.adminUser?.username,
        action: "create_admin_user",
        entityType: "admin_user",
        entityId: user.id,
        details: `Created admin user: ${username}`,
      });
      res.json({ ...user, passwordHash: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  app.put("/api/admin/users/:id", requireAdmin, requireRole(["admin"]), async (req, res) => {
    try {
      const { password, ...rest } = req.body;
      const update: any = { ...rest };
      if (password) {
        update.passwordHash = password;
      }
      const user = await storage.updateAdminUser(Number(req.params.id), update);
      res.json({ ...user, passwordHash: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to update admin user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, requireRole(["admin"]), async (req, res) => {
    try {
      if (Number(req.params.id) === req.session.adminUser?.id) {
        return res.status(400).json({ error: "Cannot delete yourself" });
      }
      await storage.deleteAdminUser(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete admin user" });
    }
  });

  // Change own password
  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await storage.getAdminUserByUsername(req.session.adminUser!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      await storage.updateAdminUser(user.id, { passwordHash: newPassword });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Export data (CSV)
  app.get("/api/admin/export/:type", requireAdmin, async (req, res) => {
    try {
      const type = req.params.type;
      let data: any[] = [];
      let filename = "";

      switch (type) {
        case "orders":
          data = await storage.getOrders();
          filename = "orders.csv";
          break;
        case "customers":
          data = await storage.getCustomers();
          filename = "customers.csv";
          break;
        case "products":
          data = await storage.getProducts();
          filename = "products.csv";
          break;
        default:
          return res.status(400).json({ error: "Invalid export type" });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "No data to export" });
      }

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => {
            const val = row[h];
            if (val === null || val === undefined) return "";
            if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          }).join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Backup database (JSON export)
  app.get("/api/admin/backup", requireAdmin, requireRole(["admin"]), async (req, res) => {
    try {
      const backup = {
        exportedAt: new Date().toISOString(),
        products: await storage.getProducts(),
        customers: await storage.getCustomers(),
        orders: await storage.getOrders(),
        promoCodes: await storage.getPromoCodes(),
        newsletterSubscribers: await storage.getNewsletterSubscribers(),
        settings: await storage.getAllStoreSettings(),
        banners: await storage.getHomepageBanners(),
        announcement: await storage.getAnnouncementBar(),
        emailTemplates: await storage.getEmailTemplates(),
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=attaie-backup-${new Date().toISOString().split("T")[0]}.json`);
      res.send(JSON.stringify(backup, null, 2));
    } catch (error) {
      res.status(500).json({ error: "Failed to create backup" });
    }
  });

  // Seed initial admin user if none exists
  await seedAdminUser();
}

async function seedAdminUser() {
  const existingUsers = await storage.getAdminUsers();
  if (existingUsers.length === 0) {
    await storage.createAdminUser({
      username: "admin",
      passwordHash: "admin123",
      email: "admin@attaiecigars.com",
      role: "admin",
    });
    console.log("Created default admin user: admin / admin123");
  }
}
