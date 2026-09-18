import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";
import {
  createCounters,
  createProduct,
  createCustomer,
  setStock,
} from "../../setup/factories.js";

let api;
let token;
let counters;

beforeAll(async () => {
  api = await startTestApi("api-sales");
  token = api.tokenFor(["sale:read", "inventory:read"]);
  counters = createCounters();
});

afterAll(async () => {
  await api.close();
});

const req = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token, ...opts });

async function stock(productId) {
  const res = await req("GET", `/api/v1/inventory/${productId}`);
  return res.body.quantity;
}

describe("POST /api/v1/sales", () => {
  it("creates a sale atomically: stock, movements, sale, and items", async () => {
    const product = await createProduct(api.db, counters, { price: "10.00" });
    const customer = await createCustomer(api.db, counters);
    await setStock(api.db, product.id, 10);

    const res = await req("POST", "/api/v1/sales", {
      body: {
        customerId: customer.id,
        items: [{ productId: product.id, quantity: 3 }],
      },
    });
    expect(res.status).toBe(201);
    expect(Number(res.body.total_amount)).toBe(30);

    // Stock deducted exactly once
    expect(await stock(product.id)).toBe(7);

    // Movement recorded
    const movements = await api.db.query(
      "SELECT * FROM inventory_movements WHERE product_id = $1",
      [product.id],
    );
    expect(movements.rows).toHaveLength(1);
    expect(movements.rows[0].quantity).toBe(-3);

    // Line items persisted with server-side pricing
    const items = await api.db.query(
      "SELECT * FROM sale_items WHERE sale_id = $1",
      [res.body.id],
    );
    expect(items.rows).toHaveLength(1);
    expect(items.rows[0].quantity).toBe(3);
    expect(Number(items.rows[0].unit_price)).toBe(10);
    expect(Number(items.rows[0].subtotal)).toBe(30);
  });

  it("rolls back everything when stock is insufficient", async () => {
    const product = await createProduct(api.db, counters, { price: "5.00" });
    const customer = await createCustomer(api.db, counters);
    await setStock(api.db, product.id, 2);
    const salesBefore = await api.db.query("SELECT COUNT(*) AS c FROM sales");

    const res = await req("POST", "/api/v1/sales", {
      body: {
        customerId: customer.id,
        items: [{ productId: product.id, quantity: 5 }],
      },
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("BUSINESS_RULE_VIOLATION");

    // No partial writes: stock intact, no sale, no items, no movements
    expect(await stock(product.id)).toBe(2);
    const salesAfter = await api.db.query("SELECT COUNT(*) AS c FROM sales");
    expect(salesAfter.rows[0].c).toBe(salesBefore.rows[0].c);
    const movements = await api.db.query(
      "SELECT COUNT(*) AS c FROM inventory_movements WHERE product_id = $1",
      [product.id],
    );
    expect(movements.rows[0].c).toBe("0");
  });

  it("returns 404 for unknown products", async () => {
    const customer = await createCustomer(api.db, counters);
    const res = await req("POST", "/api/v1/sales", {
      body: {
        customerId: customer.id,
        items: [{ productId: 999999, quantity: 1 }],
      },
    });
    expect(res.status).toBe(404);
  });

  it("validates the payload shape", async () => {
    const res = await req("POST", "/api/v1/sales", {
      body: { customerId: 1, items: [] },
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/sales", () => {
  it("lists sales", async () => {
    const res = await req("GET", "/api/v1/sales");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("rejects unauthenticated access", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/sales", {});
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown sales", async () => {
    const res = await req("GET", "/api/v1/sales/999999");
    expect(res.status).toBe(404);
  });
});
