import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";

let api;
let reader;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("api-products");
  reader = api.tokenFor(["product:read"]);
});

afterAll(async () => {
  await api.close();
});

const req = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token: reader, ...opts });

describe("products authentication and authorization", () => {
  it("rejects requests without a token", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/products", {});
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("AUTHENTICATION_ERROR");
  });

  it("rejects tokens without the product:read permission", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/products", {
      token: api.tokenFor(["sale:read"]),
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("AUTHORIZATION_ERROR");
  });
});

describe("products lifecycle", () => {
  it("creates, reads, updates, and deletes a product", async () => {
    const created = await req("POST", "/api/v1/products", {
      body: { sku: `CRUD-${++counter}`, name: "Widget", price: 29.99 },
    });
    expect(created.status).toBe(201);
    const id = created.body.id;
    expect(created.body.name).toBe("Widget");

    const fetched = await req("GET", `/api/v1/products/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.sku).toBe(created.body.sku);

    const updated = await req("PATCH", `/api/v1/products/${id}`, {
      body: { name: "Widget Pro", price: 34.99 },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe("Widget Pro");

    const deleted = await req("DELETE", `/api/v1/products/${id}`);
    expect(deleted.status).toBe(204);
    expect(await req("GET", `/api/v1/products/${id}`)).toMatchObject({
      status: 404,
    });
  });

  it("returns a structured 404 for unknown products", async () => {
    const res = await req("GET", "/api/v1/products/999999");
    expect(res.status).toBe(404);
  });

  it("validates creation input", async () => {
    const res = await req("POST", "/api/v1/products", {
      body: { sku: "ab", price: -5 },
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("ignores disallowed update fields (mass assignment safe)", async () => {
    const created = await req("POST", "/api/v1/products", {
      body: { sku: `MASS-${++counter}`, name: "Plain", price: 9.99 },
    });
    const id = created.body.id;
    const updated = await req("PATCH", `/api/v1/products/${id}`, {
      body: { id: 1, sku: "HACKED", name: "Still Plain" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.id).toBe(id);
    expect(updated.body.sku).toBe(`MASS-${counter}`);
    expect(updated.body.name).toBe("Still Plain");
  });

  it("lists products with pagination", async () => {
    const tag = `LIST-${++counter}`;
    for (let i = 0; i < 3; i++) {
      await req("POST", "/api/v1/products", {
        body: { sku: `${tag}-${i}`, name: `${tag} ${i}`, price: 1 },
      });
    }
    const page = await req("GET", `/api/v1/products?limit=2&offset=0`);
    expect(page.status).toBe(200);
    expect(Array.isArray(page.body)).toBe(true);
    expect(page.body.length).toBeLessThanOrEqual(2);
  });
});
