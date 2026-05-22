import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, checkoutSchema } from "@shared/schema";
import type { OrderItem } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, gender, sale } = req.query;

      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (sale === "true") {
        products = await storage.getSaleProducts();
      } else if (gender) {
        products = await storage.getProductsByGender(gender as string);
        if (category) {
          products = products.filter(p => p.category === category);
        }
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }

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

  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "default-session";
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "default-session";
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });

      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
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
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

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
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "default-session";
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "default-session";

      const validatedData = checkoutSchema.parse(req.body);

      const cleanCardNumber = validatedData.cardNumber.replace(/\s/g, "");
      if (cleanCardNumber !== "4242424242424242") {
        return res.status(402).json({
          message: "Payment declined. Your card was not accepted. Please use a valid card number.",
          code: "PAYMENT_DECLINED"
        });
      }

      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price,
        size: item.size,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      }));

      const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
      const shipping = 9.99;
      const total = subtotal + shipping;

      const order = await storage.createOrder({
        sessionId,
        items: orderItems,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        shippingAddress: validatedData.shippingAddress,
        shippingCity: validatedData.shippingCity,
        shippingState: validatedData.shippingState,
        shippingZip: validatedData.shippingZip,
        cardLast4: cleanCardNumber.slice(-4),
        status: "confirmed",
      });

      await storage.clearCart(sessionId);

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid checkout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
