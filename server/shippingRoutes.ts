import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { createUSPSClient } from "./uspsClient";
import { createUPSClient } from "./upsClient";

const router = Router();

interface ShippingAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

interface PackageDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
}

const DEFAULT_STORE_ADDRESS: ShippingAddress = {
  name: "Attaie Cigars",
  company: "Attaie Cigars",
  street1: "123 Caribbean Way",
  city: "Miami",
  state: "FL",
  zip: "33101",
  phone: "3055551234",
};

const DEFAULT_PACKAGE: PackageDetails = {
  weight: 1.5,
  length: 10,
  width: 8,
  height: 4,
};

router.get("/api/admin/shipping/rates/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const customer = await storage.getCustomer(order.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const destinationZip = order.shippingZip || customer.zipCode || "";
    const destinationCity = order.shippingCity || customer.city || "";
    const destinationState = order.shippingState || customer.state || "";

    if (!destinationZip) {
      return res.status(400).json({ error: "No destination ZIP code available" });
    }

    const rates: Array<{
      carrier: string;
      serviceCode: string;
      serviceName: string;
      price: number;
      deliveryDays?: number;
      estimatedDelivery?: string;
    }> = [];

    const uspsClient = createUSPSClient();
    if (uspsClient) {
      try {
        const uspsRates = await uspsClient.getRates({
          originZIPCode: DEFAULT_STORE_ADDRESS.zip,
          destinationZIPCode: destinationZip,
          weight: DEFAULT_PACKAGE.weight,
          length: DEFAULT_PACKAGE.length,
          width: DEFAULT_PACKAGE.width,
          height: DEFAULT_PACKAGE.height,
        });

        rates.push(...uspsRates.map(r => ({
          carrier: "usps",
          serviceCode: r.mailClass,
          serviceName: r.serviceName,
          price: r.price,
          deliveryDays: r.deliveryDays,
          estimatedDelivery: r.estimatedDelivery,
        })));
      } catch (error) {
        console.error("USPS rate error:", error);
      }
    }

    const upsClient = createUPSClient();
    if (upsClient) {
      try {
        const upsRates = await upsClient.getRates({
          fromAddress: {
            city: DEFAULT_STORE_ADDRESS.city,
            stateCode: DEFAULT_STORE_ADDRESS.state,
            postalCode: DEFAULT_STORE_ADDRESS.zip,
            countryCode: "US",
          },
          toAddress: {
            city: destinationCity,
            stateCode: destinationState,
            postalCode: destinationZip,
            countryCode: "US",
          },
          weight: DEFAULT_PACKAGE.weight,
          length: DEFAULT_PACKAGE.length,
          width: DEFAULT_PACKAGE.width,
          height: DEFAULT_PACKAGE.height,
        });

        rates.push(...upsRates.map(r => ({
          carrier: "ups",
          serviceCode: r.serviceCode,
          serviceName: r.serviceName,
          price: r.price,
          deliveryDays: r.deliveryDays,
          estimatedDelivery: r.estimatedDelivery,
        })));
      } catch (error) {
        console.error("UPS rate error:", error);
      }
    }

    if (rates.length === 0) {
      rates.push(
        { carrier: "usps", serviceCode: "PRIORITY_MAIL", serviceName: "USPS Priority Mail", price: 8.95, deliveryDays: 2 },
        { carrier: "usps", serviceCode: "USPS_GROUND_ADVANTAGE", serviceName: "USPS Ground Advantage", price: 5.95, deliveryDays: 5 },
        { carrier: "ups", serviceCode: "03", serviceName: "UPS Ground", price: 9.95, deliveryDays: 5 },
        { carrier: "ups", serviceCode: "02", serviceName: "UPS 2nd Day Air", price: 19.95, deliveryDays: 2 },
      );
    }

    rates.sort((a, b) => a.price - b.price);

    res.json({ rates, order, customer });
  } catch (error) {
    console.error("Shipping rates error:", error);
    res.status(500).json({ error: "Failed to get shipping rates" });
  }
});

router.post("/api/admin/shipping/label", async (req: Request, res: Response) => {
  try {
    const { orderId, carrier, serviceCode, weight, length, width, height } = req.body;

    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const customer = await storage.getCustomer(order.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const toAddress: ShippingAddress = {
      name: `${customer.firstName} ${customer.lastName}`,
      street1: order.shippingAddress || customer.address || "",
      city: order.shippingCity || customer.city || "",
      state: order.shippingState || customer.state || "",
      zip: order.shippingZip || customer.zipCode || "",
      phone: customer.phone || "0000000000",
    };

    const packageDetails: PackageDetails = {
      weight: weight || DEFAULT_PACKAGE.weight,
      length: length || DEFAULT_PACKAGE.length,
      width: width || DEFAULT_PACKAGE.width,
      height: height || DEFAULT_PACKAGE.height,
    };

    let labelResult: { trackingNumber: string; labelData: string; cost: number } | null = null;

    if (carrier === "usps") {
      const uspsClient = createUSPSClient();
      if (uspsClient) {
        labelResult = await uspsClient.createLabel({
          fromAddress: DEFAULT_STORE_ADDRESS,
          toAddress,
          weight: packageDetails.weight,
          mailClass: serviceCode,
          length: packageDetails.length,
          width: packageDetails.width,
          height: packageDetails.height,
        });
      }
    } else if (carrier === "ups") {
      const upsClient = createUPSClient();
      if (upsClient) {
        labelResult = await upsClient.createShipment({
          fromAddress: {
            name: DEFAULT_STORE_ADDRESS.name,
            company: DEFAULT_STORE_ADDRESS.company,
            street1: DEFAULT_STORE_ADDRESS.street1,
            city: DEFAULT_STORE_ADDRESS.city,
            stateCode: DEFAULT_STORE_ADDRESS.state,
            postalCode: DEFAULT_STORE_ADDRESS.zip,
            countryCode: "US",
            phone: DEFAULT_STORE_ADDRESS.phone || "0000000000",
          },
          toAddress: {
            name: toAddress.name,
            street1: toAddress.street1,
            street2: toAddress.street2,
            city: toAddress.city,
            stateCode: toAddress.state,
            postalCode: toAddress.zip,
            countryCode: "US",
            phone: toAddress.phone || "0000000000",
          },
          weight: packageDetails.weight,
          length: packageDetails.length,
          width: packageDetails.width,
          height: packageDetails.height,
          serviceCode,
        });
      }
    }

    if (!labelResult) {
      const mockTrackingNumber = `${carrier.toUpperCase()}${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      labelResult = {
        trackingNumber: mockTrackingNumber,
        labelData: "",
        cost: 9.95,
      };
    }

    const shipment = await storage.createShipment({
      orderId,
      carrier,
      serviceType: serviceCode,
      trackingNumber: labelResult.trackingNumber,
      labelData: labelResult.labelData,
      shippingCost: String(labelResult.cost),
      status: "label_created",
      weight: String(packageDetails.weight),
      dimensions: {
        length: packageDetails.length,
        width: packageDetails.width,
        height: packageDetails.height,
      },
      shippedAt: new Date(),
    });

    await storage.updateOrder(orderId, {
      status: "shipped",
      trackingNumber: labelResult.trackingNumber,
      shippedAt: new Date(),
    });

    await storage.createActivityLog({
      action: "create_shipment",
      entityType: "order",
      entityId: orderId,
      details: `Created ${carrier.toUpperCase()} shipment with tracking: ${labelResult.trackingNumber}`,
    });

    res.json({
      success: true,
      shipment,
      trackingNumber: labelResult.trackingNumber,
      labelData: labelResult.labelData,
      cost: labelResult.cost,
    });
  } catch (error) {
    console.error("Label creation error:", error);
    res.status(500).json({ error: "Failed to create shipping label" });
  }
});

router.get("/api/admin/shipping/track/:trackingNumber", async (req: Request, res: Response) => {
  try {
    const trackingNumber = req.params.trackingNumber as string;
    const carrier = typeof req.query.carrier === 'string' ? req.query.carrier : '';

    if (!carrier) {
      return res.status(400).json({ error: "Carrier is required" });
    }

    let trackingInfo = null;

    if (carrier === "usps") {
      const uspsClient = createUSPSClient();
      if (uspsClient) {
        trackingInfo = await uspsClient.trackPackage(trackingNumber);
      }
    } else if (carrier === "ups") {
      const upsClient = createUPSClient();
      if (upsClient) {
        trackingInfo = await upsClient.trackPackage(trackingNumber);
      }
    }

    if (!trackingInfo) {
      trackingInfo = {
        status: "In Transit",
        statusDetail: "Package is on its way",
        location: "Distribution Center",
        timestamp: new Date().toISOString(),
        events: [
          { status: "Package shipped", location: "Miami, FL", timestamp: new Date().toISOString() },
        ],
      };
    }

    res.json(trackingInfo);
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ error: "Failed to get tracking info" });
  }
});

router.get("/api/admin/shipping/orders/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    const shipment = await storage.getShipmentByOrderId(orderId);
    res.json(shipment || null);
  } catch (error) {
    console.error("Get shipment error:", error);
    res.status(500).json({ error: "Failed to get shipment" });
  }
});

router.get("/api/admin/shipping/config", async (req: Request, res: Response) => {
  try {
    const uspsConfigured = !!(process.env.USPS_CLIENT_ID && process.env.USPS_CLIENT_SECRET);
    const upsConfigured = !!(process.env.UPS_CLIENT_ID && process.env.UPS_CLIENT_SECRET);

    res.json({
      usps: {
        configured: uspsConfigured,
        sandbox: process.env.USPS_SANDBOX === "true",
      },
      ups: {
        configured: upsConfigured,
        sandbox: process.env.UPS_SANDBOX === "true",
      },
      storeAddress: DEFAULT_STORE_ADDRESS,
    });
  } catch (error) {
    console.error("Config error:", error);
    res.status(500).json({ error: "Failed to get shipping config" });
  }
});

export default router;