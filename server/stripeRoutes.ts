import type { Express } from 'express';
import { getUncachableStripeClient, getStripePublishableKey } from './stripeClient';
import { stripeStorage } from './stripeStorage';
import { storage } from './storage';

export function registerStripeRoutes(app: Express) {
  app.get('/api/stripe/publishable-key', async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error('Error getting publishable key:', error);
      res.status(500).json({ error: 'Failed to get Stripe key' });
    }
  });

  app.get('/api/stripe/products', async (req, res) => {
    try {
      const rows = await stripeStorage.listProductsWithPrices();
      
      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            images: row.product_images,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/stripe/checkout', async (req, res) => {
    try {
      const { items, customerEmail } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items are required' });
      }

      const stripe = await getUncachableStripeClient();
      
      const lineItems = items.map((item: { priceId: string; quantity: number }) => ({
        price: item.priceId,
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: customerEmail,
        metadata: {
          source: 'attaie-cigars'
        }
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  app.get('/api/stripe/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product']
      });

      if (session.payment_status === 'paid') {
        const totalAmount = ((session.amount_total || 0) / 100).toFixed(2);
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        const addressParts = session.customer_details?.address;
        
        await storage.createOrder({
          orderNumber,
          customerId: 0,
          subtotal: totalAmount,
          total: totalAmount,
          status: 'pending',
          shippingAddress: addressParts?.line1 || null,
          shippingCity: addressParts?.city || null,
          shippingState: addressParts?.state || null,
          shippingZip: addressParts?.postal_code || null,
          notes: `Stripe Session: ${sessionId}, Email: ${session.customer_details?.email || 'N/A'}`,
        });
      }

      res.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
        currency: session.currency,
      });
    } catch (error: any) {
      console.error('Session retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  });
}
