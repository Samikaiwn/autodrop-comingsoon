import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { processEmailInquiry, generateEmailCampaign } from "./bots/email-bot";
import { processSMSInquiry, handlePhoneCall, getPhoneNumber, isTwilioConfigured } from "./bots/sms-phone-bot";
import { generateProductAd, generatePageDecorations, generateSocialMediaContent } from "./bots/ad-creation-bot";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search, limit = "50", offset = "0" } = req.query;
      const products = await storage.getProducts(
        categoryId as string,
        search as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // AliExpress integration
  app.post("/api/aliexpress/import", async (req, res) => {
    try {
      const aliexpressKey = process.env.ALIEXPRESS_APP_KEY || process.env.ALIEXPRESS_API_KEY || "517196";
      const aliexpressSecret = process.env.ALIEXPRESS_APP_SECRET || process.env.ALIEXPRESS_SECRET || "BZ4tYOlstoyodeOMiMpOxqsJuR7zEDfG";
      
      if (!aliexpressKey || !aliexpressSecret) {
        return res.status(400).json({ message: "AliExpress API credentials not configured" });
      }

      const { productUrl, aliexpressId } = req.body;
      
      if (!productUrl && !aliexpressId) {
        return res.status(400).json({ message: "Product URL or AliExpress ID required" });
      }

      // Check if product already exists
      if (aliexpressId) {
        const existingProduct = await storage.getProductByAliexpressId(aliexpressId);
        if (existingProduct) {
          return res.json(existingProduct);
        }
      }

      // In a real implementation, you would make API calls to AliExpress here
      // For now, we'll create a mock product based on the provided data
      const mockProductData = {
        title: `Imported Product ${Date.now()}`,
        description: "Product imported from AliExpress",
        price: "29.99",
        originalPrice: "39.99",
        rating: "4.5",
        ratingCount: 100,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: "3", // Electronics
        aliexpressId: aliexpressId || `mock_${Date.now()}`,
        inStock: true,
      };

      const validatedData = insertProductSchema.parse(mockProductData);
      const product = await storage.createProduct(validatedData);
      
      res.json(product);
    } catch (error) {
      console.error("AliExpress import error:", error);
      res.status(500).json({ message: "Failed to import product from AliExpress" });
    }
  });

  // Cart management
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.userId);
      
      // Enrich cart items with product data
      const enrichedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId!);
          return {
            ...item,
            product,
          };
        })
      );
      
      res.json(enrichedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      // Check if item already exists in cart
      const existingItems = await storage.getCartItems(validatedData.userId!);
      const existingItem = existingItems.find(item => item.productId === validatedData.productId);
      
      if (existingItem) {
        // Update quantity
        const updatedItem = await storage.updateCartItem(
          existingItem.id,
          existingItem.quantity + (validatedData.quantity || 1)
        );
        res.json(updatedItem);
      } else {
        // Add new item
        const cartItem = await storage.addToCart(validatedData);
        res.json(cartItem);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const updatedItem = await storage.updateCartItem(req.params.id, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const removed = await storage.removeFromCart(req.params.id);
      
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Stripe checkout
  app.post("/api/checkout", async (req, res) => {
    try {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeKey) {
        return res.status(500).json({ message: "Stripe API key not configured" });
      }

      const stripe = require('stripe')(stripeKey);
      const { userId, items, totalAmount, shippingAddress } = req.body;
      
      // Create line items for Stripe checkout
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      // Determine base URL for redirects
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://autodropplatform.shop' 
        : `http://localhost:5000`;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel.html`,
        metadata: {
          userId: userId,
          orderId: `order_${Date.now()}`,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES'],
        },
      });

      // Create order in database
      const orderData = {
        userId,
        stripePaymentIntentId: session.id,
        status: "pending",
        totalAmount: totalAmount.toString(),
        items,
        shippingAddress,
      };

      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after successful session creation
      await storage.clearCart(userId);
      
      res.json({
        orderId: order.id,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.warn("Stripe webhook secret not configured");
        return res.status(200).send("OK");
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        
        if (orderId) {
          // Update order status to completed
          // Note: This would require implementing updateOrderStatus in storage
          console.log(`Payment completed for order: ${orderId}`);
        }
      }
      
      res.status(200).send("OK");
    } catch (error) {
      console.error("Stripe webhook error:", error);
      res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Orders
  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, category, limit = "20", offset = "0" } = req.query;
      
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const products = await storage.getProducts(
        category as string,
        q,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Bot API routes
  app.post("/api/bots/email", async (req, res) => {
    try {
      const { from, subject, body } = req.body;
      
      const result = await processEmailInquiry({
        from,
        subject,
        body
      });
      
      res.json(result);
    } catch (error) {
      console.error("Email bot error:", error);
      res.status(500).json({ message: "Email bot processing failed" });
    }
  });

  app.post("/api/bots/sms", async (req, res) => {
    try {
      const { from, body } = req.body;
      
      const result = await processSMSInquiry({
        from,
        body
      });
      
      res.json(result);
    } catch (error) {
      console.error("SMS bot error:", error);
      res.status(500).json({ message: "SMS bot processing failed" });
    }
  });

  app.get("/api/bots/phone-number", async (req, res) => {
    try {
      res.json({ 
        phoneNumber: getPhoneNumber(),
        configured: isTwilioConfigured()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot phone number" });
    }
  });

  app.post("/api/bots/ads/product/:productId", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const { platform = 'facebook' } = req.body;
      const ad = await generateProductAd(product, platform);
      
      res.json(ad);
    } catch (error) {
      console.error("Ad generation error:", error);
      res.status(500).json({ message: "Ad generation failed" });
    }
  });



  app.post("/api/bots/decorations", async (req, res) => {
    try {
      const { theme = 'modern' } = req.body;
      
      const decorations = await generatePageDecorations(theme);
      
      res.json(decorations);
    } catch (error) {
      console.error("Page decoration generation error:", error);
      res.status(500).json({ message: "Page decoration generation failed" });
    }
  });

  app.post("/api/bots/email-campaign", async (req, res) => {
    try {
      const { type = 'newsletter' } = req.body;
      
      const campaign = await generateEmailCampaign(type);
      
      res.json(campaign);
    } catch (error) {
      console.error("Email campaign generation error:", error);
      res.status(500).json({ message: "Email campaign generation failed" });
    }
  });

  // Twilio webhook for incoming SMS
  app.post("/api/webhooks/twilio/sms", async (req, res) => {
    try {
      const { From, Body } = req.body;
      
      await processSMSInquiry({
        from: From,
        body: Body
      });
      
      res.status(200).send("OK");
    } catch (error) {
      console.error("Twilio SMS webhook error:", error);
      res.status(500).send("Error");
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      aliexpressConfigured: !!(process.env.ALIEXPRESS_APP_KEY || process.env.ALIEXPRESS_API_KEY),
      stripeConfigured: !!(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY),
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      sendgridConfigured: !!process.env.SENDGRID_API_KEY,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
