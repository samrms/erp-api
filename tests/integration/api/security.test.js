import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";
import { createCounters, createProduct } from "../../setup/factories.js";

let api;
let token;
let counters;
let n = 0;

beforeAll(async () => {
  api = await startTestApi("api-security");
  token = api.tokenFor(["product:read", "sale:read"]);
  counters = createCounters();
});

afterAll(async () => {
  await api.close();
});

const req = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token, ...opts });

describe("HTTP security boundaries", () => {
  it("sends helmet security headers", async () => {
    const res = await req("GET", "/api/v1/products");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBeDefined();
  });

  it("survives SQL injection attempts in update keys", async () => {
    const product = await createProduct(api.db, counters);
    const res = await req("PATCH", `/api/v1/products/${product.id}`, {
      body: { "name'; DROP TABLE products; --": "x", name: "Intact" },
    });
    expect(res.status).toBe(200);
    // Table still exists and row is intact
    const list = await req("GET", "/api/v1/products");
    expect(list.status).toBe(200);
    expect(list.body.some((p) => p.id === product.id)).toBe(true);
  });

  it("rejects hostile sort parameters at validation (repository allowlist is the second layer)", async () => {
    const res = await req(
      "GET",
      "/api/v1/products?sortField=id%3B%20DROP%20TABLE%20products&sortOrder=desc",
    );
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    // Table still intact regardless of layer
    const list = await req("GET", "/api/v1/products");
    expect(list.status).toBe(200);
  });

  it("attempts to inject via search are treated as plain text", async () => {
    const res = await req(
      "GET",
      "/api/v1/products?search=%27%20OR%20%271%27%3D%271",
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("drops mass-assigned fields instead of persisting them", async () => {
    const res = await req("POST", "/api/v1/products", {
      body: {
        sku: `SEC-${++n}`,
        name: "Secure",
        price: 1,
        isAdmin: true,
        password_hash: "x",
      },
    });
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty("isAdmin");
    expect(res.body).not.toHaveProperty("password_hash");
  });

  it("rejects oversized bodies with 413", async () => {
    const res = await req("POST", "/api/v1/products", {
      body: { sku: "BIG", name: "x".repeat(20 * 1024), price: 1 },
    });
    expect(res.status).toBe(413);
  });

  it("rejects malformed JSON with 400 (never 500)", async () => {
    const res = await fetch(`${api.baseUrl}/api/v1/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: '{"sku": broken',
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });

  it("never leaks password hashes through auth endpoints", async () => {
    const address = `leak-${++n}@example.com`;
    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: { email: address, password: "secret123", firstName: "No" },
      },
    );
    expect(JSON.stringify(registered.body)).not.toContain("password_hash");
    const logged = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email: address, password: "secret123" },
    });
    expect(JSON.stringify(logged.body)).not.toContain("password_hash");
  });

  it("tampered tokens are 401, not 500", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/products", {
      token: token.slice(0, -2) + "xx",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("AUTHENTICATION_ERROR");
  });
});

describe("rate limiting", () => {
  it("throttles abusive clients with 429", async () => {
    // Dedicated app instance: the limiter budget (100/15min) is per instance.
    const isolated = await startTestApi("api-ratelimit");
    try {
      const statuses = [];
      for (let i = 0; i < 101; i++) {
        const res = await apiFetch(
          isolated.baseUrl,
          "GET",
          "/api/v1/health",
          {},
        );
        statuses.push(res.status);
      }
      expect(statuses.slice(0, 100).every((s) => s === 200)).toBe(true);
      expect(statuses[100]).toBe(429);
    } finally {
      await isolated.close();
    }
  }, 30000);
});
