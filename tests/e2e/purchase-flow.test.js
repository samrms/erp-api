import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../setup/api.js";
import { grantPermissions } from "../setup/factories.js";

let api;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("e2e-purchase-flow");
});

afterAll(async () => {
  await api.close();
});

describe("purchase flow", () => {
  it("registers, earns permissions, stocks a product, sells it, and logs out", async () => {
    const email = `buyer-${++counter}@example.com`;

    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: {
          email,
          password: "secret123",
          firstName: "End",
          lastName: "ToEnd",
        },
      },
    );
    expect(registered.status).toBe(201);

    await grantPermissions(api.db, registered.body.id, [
      "product:read",
      "customer:read",
      "inventory:read",
      "sale:read",
    ]);
    const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email, password: "secret123" },
    });
    expect(login.status).toBe(200);
    const token = login.body.token;
    const auth = (method, path, opts = {}) =>
      apiFetch(api.baseUrl, method, path, { token, ...opts });

    const product = await auth("POST", "/api/v1/products", {
      body: { sku: `E2E-${counter}`, name: "E2E Widget", price: 15 },
    });
    expect(product.status).toBe(201);

    const customer = await auth("POST", "/api/v1/customers", {
      body: { name: "E2E Customer" },
    });
    expect(customer.status).toBe(201);

    const stocked = await auth(
      "PATCH",
      `/api/v1/inventory/${product.body.id}/adjust`,
      { body: { quantity: 20 } },
    );
    expect(stocked.body.quantity).toBe(20);

    const sale = await auth("POST", "/api/v1/sales", {
      body: {
        customerId: customer.body.id,
        items: [{ productId: product.body.id, quantity: 6 }],
      },
    });
    expect(sale.status).toBe(201);
    expect(Number(sale.body.total_amount)).toBe(90);

    const remaining = await auth("GET", `/api/v1/inventory/${product.body.id}`);
    expect(remaining.body.quantity).toBe(14);

    const logout = await auth("POST", "/api/v1/auth/logout");
    expect(logout.status).toBe(200);
    const reused = await auth("GET", "/api/v1/products");
    expect(reused.status).toBe(401);
  });

  it("a fresh user without grants is fenced out of every module", async () => {
    const email = `fenced-${++counter}@example.com`;
    await apiFetch(api.baseUrl, "POST", "/api/v1/auth/register", {
      body: { email, password: "secret123", firstName: "Fenced" },
    });
    const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email, password: "secret123" },
    });
    const token = login.body.token;
    for (const path of [
      "/api/v1/products",
      "/api/v1/customers",
      "/api/v1/suppliers",
      "/api/v1/sales",
      "/api/v1/inventory/1",
      "/api/v1/jobs/1",
    ]) {
      const res = await apiFetch(api.baseUrl, "GET", path, { token });
      expect(res.status, path).toBe(403);
    }
  });
});
