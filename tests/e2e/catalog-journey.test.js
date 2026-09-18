import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../setup/api.js";
import { grantPermissions } from "../setup/factories.js";

let api;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("e2e-catalog-journey");
});

afterAll(async () => {
  await api.close();
});

describe("catalog journey", () => {
  it("supplier, products, search, repricing, and the new price flows into sales", async () => {
    const tag = `CAT-${++counter}`;
    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: {
          email: `${tag}@example.com`,
          password: "secret123",
          firstName: "Cat",
        },
      },
    );
    await grantPermissions(api.db, registered.body.id, [
      "product:read",
      "supplier:read",
      "customer:read",
      "inventory:read",
      "sale:read",
    ]);
    const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email: `${tag}@example.com`, password: "secret123" },
    });
    const token = login.body.token;
    const auth = (method, path, opts = {}) =>
      apiFetch(api.baseUrl, method, path, { token, ...opts });

    const supplier = await auth("POST", "/api/v1/suppliers", {
      body: { name: `${tag} Supplier` },
    });
    expect(supplier.status).toBe(201);

    const p1 = await auth("POST", "/api/v1/products", {
      body: { sku: `${tag}-P1`, name: `${tag} Widget`, price: 10 },
    });
    const p2 = await auth("POST", "/api/v1/products", {
      body: { sku: `${tag}-P2`, name: `${tag} Gadget`, price: 5 },
    });
    expect(p1.status).toBe(201);
    expect(p2.status).toBe(201);

    const search = await auth("GET", `/api/v1/products?search=${tag}%20Widget`);
    expect(search.body.some((p) => p.id === p1.body.id)).toBe(true);

    const repriced = await auth("PATCH", `/api/v1/products/${p1.body.id}`, {
      body: { price: 12 },
    });
    expect(Number(repriced.body.price)).toBe(12);

    const customer = await auth("POST", "/api/v1/customers", {
      body: { name: `${tag} Buyer` },
    });
    await auth("PATCH", `/api/v1/inventory/${p1.body.id}/adjust`, {
      body: { quantity: 10 },
    });
    await auth("PATCH", `/api/v1/inventory/${p2.body.id}/adjust`, {
      body: { quantity: 10 },
    });

    const sale = await auth("POST", "/api/v1/sales", {
      body: {
        customerId: customer.body.id,
        items: [
          { productId: p1.body.id, quantity: 2 },
          { productId: p2.body.id, quantity: 3 },
        ],
      },
    });
    expect(sale.status).toBe(201);
    expect(Number(sale.body.total_amount)).toBe(39);

    const items = await api.db.query(
      "SELECT product_id, quantity, unit_price FROM sale_items WHERE sale_id = $1 ORDER BY product_id",
      [sale.body.id],
    );
    expect(items.rows).toHaveLength(2);
    expect(Number(items.rows[0].unit_price)).toBe(12);
  });
});
