import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./setup";

let app: Express;
const SESSION = "test-cart-session";

beforeAll(async () => {
  ({ app } = await createTestApp());
});

beforeEach(async () => {
  await request(app).delete("/api/cart").set("x-session-id", SESSION);
});

describe("Cart operations", () => {
  it("starts with an empty cart", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("adds an item to the cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.productId).toBe("nike-air-max-pro");
    expect(res.body.size).toBe(10);
    expect(res.body.quantity).toBe(1);
  });

  it("retrieves cart items with product details", async () => {
    await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });

    const res = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].product).toBeDefined();
    expect(res.body[0].product.name).toBe("Nike Air Max Pro");
    expect(res.body[0].product.price).toBe("129.99");
  });

  it("updates item quantity", async () => {
    const addRes = await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    const itemId = addRes.body.id;

    const res = await request(app)
      .put(`/api/cart/${itemId}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it("removes an item from the cart", async () => {
    const addRes = await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    const itemId = addRes.body.id;

    const delRes = await request(app).delete(`/api/cart/${itemId}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(getRes.body).toHaveLength(0);
  });

  it("clears the entire cart", async () => {
    await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-revolution-6", quantity: 2, size: 9 });

    const clearRes = await request(app)
      .delete("/api/cart")
      .set("x-session-id", SESSION);
    expect(clearRes.status).toBe(204);

    const getRes = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION);
    expect(getRes.body).toHaveLength(0);
  });

  it("isolates carts by session ID", async () => {
    await request(app)
      .post("/api/cart")
      .set("x-session-id", "session-a")
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    await request(app)
      .post("/api/cart")
      .set("x-session-id", "session-b")
      .send({ productId: "nike-revolution-6", quantity: 1, size: 9 });

    const cartA = await request(app)
      .get("/api/cart")
      .set("x-session-id", "session-a");
    const cartB = await request(app)
      .get("/api/cart")
      .set("x-session-id", "session-b");

    expect(cartA.body).toHaveLength(1);
    expect(cartA.body[0].productId).toBe("nike-air-max-pro");
    expect(cartB.body).toHaveLength(1);
    expect(cartB.body[0].productId).toBe("nike-revolution-6");

    // cleanup
    await request(app).delete("/api/cart").set("x-session-id", "session-a");
    await request(app).delete("/api/cart").set("x-session-id", "session-b");
  });

  it("rejects add-to-cart with missing required fields", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro" }); // missing size
    expect(res.status).toBe(400);
  });

  it("returns 404 when updating nonexistent cart item", async () => {
    const res = await request(app)
      .put("/api/cart/nonexistent-id")
      .send({ quantity: 2 });
    expect(res.status).toBe(404);
  });

  it("returns 404 when removing nonexistent cart item", async () => {
    const res = await request(app).delete("/api/cart/nonexistent-id");
    expect(res.status).toBe(404);
  });

  it("rejects invalid quantity on update", async () => {
    const addRes = await request(app)
      .post("/api/cart")
      .set("x-session-id", SESSION)
      .send({ productId: "nike-air-max-pro", quantity: 1, size: 10 });
    const itemId = addRes.body.id;

    const res = await request(app)
      .put(`/api/cart/${itemId}`)
      .send({ quantity: -1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid quantity");
  });
});
