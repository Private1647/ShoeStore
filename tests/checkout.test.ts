import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./setup";

let app: Express;
const SESSION = "test-checkout-session";

const validCheckout = {
  customerName: "Test User",
  customerEmail: "test@example.com",
  shippingAddress: "123 Test St",
  shippingCity: "New York",
  shippingState: "NY",
  shippingZip: "10001",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/28",
  cardCvv: "123",
  cardholderName: "Test User",
};

beforeAll(async () => {
  ({ app } = await createTestApp());
});

beforeEach(async () => {
  await request(app).delete("/api/cart").set("x-session-id", SESSION);
});

async function addItemToCart() {
  await request(app)
    .post("/api/cart")
    .set("x-session-id", SESSION)
    .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
}

describe("POST /api/checkout", () => {
  it("succeeds with test card 4242 4242 4242 4242", async () => {
    await addItemToCart();

    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send(validCheckout);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.customerName).toBe("Test User");
    expect(res.body.customerEmail).toBe("test@example.com");
    expect(res.body.cardLast4).toBe("4242");
    expect(res.body.status).toBe("confirmed");
    expect(res.body.subtotal).toBe("129.99");
    expect(res.body.shipping).toBe("9.99");
    expect(res.body.total).toBe("139.98");
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productName).toBe("Nike Air Max Pro");
    expect(res.body.items[0].size).toBe(10);
  });

  it("clears cart after successful checkout", async () => {
    await addItemToCart();

    await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send(validCheckout);

    const cartRes = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(cartRes.body).toHaveLength(0);
  });

  it("returns 402 for declined card", async () => {
    await addItemToCart();

    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send({ ...validCheckout, cardNumber: "1111 2222 3333 4444" });

    expect(res.status).toBe(402);
    expect(res.body.code).toBe("PAYMENT_DECLINED");
    expect(res.body.message).toContain("Payment declined");
  });

  it("does not clear cart on declined payment", async () => {
    await addItemToCart();

    await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send({ ...validCheckout, cardNumber: "1111 2222 3333 4444" });

    const cartRes = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(cartRes.body).toHaveLength(1);
  });

  it("returns 400 for empty cart", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send(validCheckout);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Cart is empty");
  });

  it("returns 400 for missing required fields", async () => {
    await addItemToCart();

    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send({ customerName: "Test" }); // missing most fields

    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    await addItemToCart();

    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send({ ...validCheckout, customerEmail: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("calculates correct total for multiple items", async () => {
    await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 }); // $129.99
    await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-revolution-6", quantity: 2, size: 9 }); // $74.99 × 2

    const res = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send(validCheckout);

    expect(res.status).toBe(201);
    // subtotal = 129.99 + (74.99 * 2) = 279.97
    expect(res.body.subtotal).toBe("279.97");
    expect(res.body.shipping).toBe("9.99");
    // total = 279.97 + 9.99 = 289.96
    expect(res.body.total).toBe("289.96");
    expect(res.body.items).toHaveLength(2);
  });
});

describe("GET /api/orders/:id", () => {
  it("retrieves a placed order by ID", async () => {
    await addItemToCart();

    const orderRes = await request(app)
      .post("/api/checkout")
      .set("x-session-id", SESSION)
      .send(validCheckout);

    const orderId = orderRes.body.id;

    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
    expect(res.body.status).toBe("confirmed");
    expect(res.body.customerName).toBe("Test User");
    expect(res.body.items).toHaveLength(1);
  });

  it("returns 404 for nonexistent order", async () => {
    const res = await request(app).get(
      "/api/orders/00000000-0000-0000-0000-000000000000"
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });
});
