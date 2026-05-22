import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./setup";

let app: Express;

beforeAll(async () => {
  ({ app } = await createTestApp());
});

describe("GET /api/products", () => {
  it("returns all 24 products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(24);
  });

  it("each product has required fields", async () => {
    const res = await request(app).get("/api/products");
    const product = res.body[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("category");
    expect(product).toHaveProperty("brand");
    expect(product).toHaveProperty("imageUrl");
    expect(product).toHaveProperty("sizes");
    expect(product).toHaveProperty("inStock");
  });

  it("filters by category=athletic", async () => {
    const res = await request(app).get("/api/products?category=athletic");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(p.category).toBe("athletic");
    }
  });

  it("filters by category=casual", async () => {
    const res = await request(app).get("/api/products?category=casual");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(p.category).toBe("casual");
    }
  });

  it("filters by category=dress", async () => {
    const res = await request(app).get("/api/products?category=dress");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(p.category).toBe("dress");
    }
  });

  it("filters by gender=men (includes unisex)", async () => {
    const res = await request(app).get("/api/products?gender=men");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(["men", "unisex"]).toContain(p.gender);
    }
    expect(res.body.some((p: any) => p.gender === "men")).toBe(true);
  });

  it("filters by gender=women (includes unisex)", async () => {
    const res = await request(app).get("/api/products?gender=women");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(["women", "unisex"]).toContain(p.gender);
    }
    expect(res.body.some((p: any) => p.gender === "women")).toBe(true);
  });

  it("filters by sale=true", async () => {
    const res = await request(app).get("/api/products?sale=true");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(p.isOnSale).toBe(true);
    }
  });

  it("searches products by name", async () => {
    const res = await request(app).get("/api/products?search=Nike");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    for (const p of res.body) {
      expect(p.name.toLowerCase()).toContain("nike");
    }
  });

  it("search returns empty array for nonexistent brand", async () => {
    const res = await request(app).get("/api/products?search=ZZZZNOTABRAND");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("combines gender and category filters", async () => {
    const res = await request(app).get(
      "/api/products?gender=women&category=athletic"
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const p of res.body) {
      expect(["women", "unisex"]).toContain(p.gender);
      expect(p.category).toBe("athletic");
    }
  });
});

describe("GET /api/products/:id", () => {
  it("returns a specific product by slug", async () => {
    const res = await request(app).get("/api/products/nike-air-max-pro");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("nike-air-max-pro");
    expect(res.body.name).toBe("Nike Air Max Pro");
    expect(res.body.price).toBe("129.99");
    expect(res.body.brand).toBe("Nike");
    expect(res.body.sizes).toEqual(
      expect.arrayContaining([7, 8, 9, 10, 11, 12, 13, 14])
    );
  });

  it("returns 404 for nonexistent product", async () => {
    const res = await request(app).get("/api/products/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});
