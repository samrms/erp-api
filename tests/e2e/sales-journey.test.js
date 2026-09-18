import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../setup/api.js";
import { grantPermissions } from "../setup/factories.js";

let api;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("e2e-sales-journey");
});

afterAll(async () => {
  await api.close();
});

describe("failed sale, restock, and retry", () => {
  it("rejects the oversell, restocks, then completes the same order", async () => {
    const tag = `RETRY-${++counter}`;
    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: {
          email: `${tag}@example.com`,
          password: "secret123",
          firstName: "Re",
        },
      },
    );
    await grantPermissions(api.db, registered.body.id, [
      "product:read",
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

    const product = await auth("POST", "/api/v1/products", {
      body: { sku: `${tag}`, name: `${tag} Item`, price: 7 },
    });
    const customer = await auth("POST", "/api/v1/customers", {
      body: { name: `${tag} Buyer` },
    });
    await auth("PATCH", `/api/v1/inventory/${product.body.id}/adjust`, {
      body: { quantity: 2 },
    });

    const order = {
      customerId: customer.body.id,
      items: [{ productId: product.body.id, quantity: 5 }],
    };
    const denied = await auth("POST", "/api/v1/sales", { body: order });
    expect(denied.status).toBe(422);

    const salesBefore = await api.db.query("SELECT COUNT(*) AS c FROM sales");
    const stockBefore = await auth(
      "GET",
      `/api/v1/inventory/${product.body.id}`,
    );
    expect(stockBefore.body.quantity).toBe(2);
    expect(salesBefore.rows[0].c).toBe("0");

    await auth("PATCH", `/api/v1/inventory/${product.body.id}/adjust`, {
      body: { quantity: 10 },
    });

    const completed = await auth("POST", "/api/v1/sales", { body: order });
    expect(completed.status).toBe(201);
    expect(Number(completed.body.total_amount)).toBe(35);

    const stockAfter = await auth(
      "GET",
      `/api/v1/inventory/${product.body.id}`,
    );
    expect(stockAfter.body.quantity).toBe(7);
  });
});
