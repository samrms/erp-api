import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";
import {
  createCounters,
  createProduct,
  setStock,
} from "../../setup/factories.js";

let api;
let token;
let counters;

beforeAll(async () => {
  api = await startTestApi("api-inventory");
  token = api.tokenFor(["inventory:read"]);
  counters = createCounters();
});

afterAll(async () => {
  await api.close();
});

const req = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token, ...opts });

describe("inventory endpoints", () => {
  it("reports zero stock for products never stocked", async () => {
    const product = await createProduct(api.db, counters);
    const res = await req("GET", `/api/v1/inventory/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ productId: product.id, quantity: 0 });
  });

  it("adjusts stock relatively in both directions", async () => {
    const product = await createProduct(api.db, counters);
    await setStock(api.db, product.id, 10);

    const up = await req("PATCH", `/api/v1/inventory/${product.id}/adjust`, {
      body: { quantity: 5 },
    });
    expect(up.status).toBe(200);
    expect(up.body.quantity).toBe(15);

    const down = await req("PATCH", `/api/v1/inventory/${product.id}/adjust`, {
      body: { quantity: -6 },
    });
    expect(down.status).toBe(200);
    expect(down.body.quantity).toBe(9);
  });

  it("refuses adjustments that would drive stock negative", async () => {
    const product = await createProduct(api.db, counters);
    await setStock(api.db, product.id, 3);
    const res = await req("PATCH", `/api/v1/inventory/${product.id}/adjust`, {
      body: { quantity: -4 },
    });
    expect(res.status).toBe(422);
    const check = await req("GET", `/api/v1/inventory/${product.id}`);
    expect(check.body.quantity).toBe(3);
  });

  it("records stock movements", async () => {
    const product = await createProduct(api.db, counters);
    const res = await req("POST", "/api/v1/inventory/movements", {
      body: {
        productId: product.id,
        quantity: 20,
        movementType: "restock",
        reason: "supplier shipment",
      },
    });
    expect(res.status).toBe(201);
  });

  it("validates adjustment and movement payloads", async () => {
    const product = await createProduct(api.db, counters);
    const badAdjust = await req(
      "PATCH",
      `/api/v1/inventory/${product.id}/adjust`,
      { body: { quantity: "many" } },
    );
    expect(badAdjust.status).toBe(400);

    const badMovement = await req("POST", "/api/v1/inventory/movements", {
      body: { productId: product.id, quantity: 1 },
    });
    expect(badMovement.status).toBe(400);
  });

  it("rejects unauthenticated access", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/inventory/1", {});
    expect(res.status).toBe(401);
  });
});
