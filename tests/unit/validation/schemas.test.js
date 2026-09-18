import { describe, it, expect } from "vitest";
import { validationResult } from "express-validator";
import {
  registerValidators,
  loginValidators,
  changePasswordValidators,
} from "../../../src/modules/auth/schemas/authSchemas.js";
import {
  createProductValidators,
  updateProductValidators,
  listProductsValidators,
} from "../../../src/modules/products/schemas/productSchemas.js";
import { createSaleValidators } from "../../../src/modules/sales/schemas/saleSchemas.js";
import { submitJobValidators } from "../../../src/modules/jobs/schemas/jobSchemas.js";
import { adjustValidators } from "../../../src/modules/inventory/schemas/inventorySchemas.js";

async function run(chains, { body = {}, params = {}, query = {} } = {}) {
  const req = { body, params, query };
  for (const chain of chains) {
    await chain.run(req);
  }
  return validationResult(req)
    .array()
    .map((e) => e.path);
}

describe("request schemas", () => {
  it("accepts a valid registration and flags email plus short password", async () => {
    expect(
      await run(registerValidators, {
        body: { email: "a@b.com", password: "secret123" },
      }),
    ).toEqual([]);
    expect(
      await run(registerValidators, {
        body: { email: "bad", password: "123" },
      }),
    ).toEqual(expect.arrayContaining(["email", "password"]));
  });

  it("requires a password on login and both passwords on change", async () => {
    expect(
      await run(loginValidators, { body: { email: "a@b.com" } }),
    ).toContain("password");
    expect(
      await run(changePasswordValidators, {
        body: { currentPassword: "x", newPassword: "123" },
      }),
    ).toContain("newPassword");
  });

  it("enforces product creation rules", async () => {
    expect(
      await run(createProductValidators, {
        body: { sku: "AB", name: "", price: -1 },
      }),
    ).toEqual(expect.arrayContaining(["sku", "name", "price"]));
    expect(
      await run(createProductValidators, {
        body: { sku: "ABC-1", name: "Widget", price: 9.99 },
      }),
    ).toEqual([]);
  });

  it("allows partial product updates but validates present fields", async () => {
    expect(
      await run(updateProductValidators, {
        params: { id: "1" },
        body: { price: -2 },
      }),
    ).toContain("price");
    expect(
      await run(updateProductValidators, {
        params: { id: "1" },
        body: { name: "Renamed" },
      }),
    ).toEqual([]);
  });

  it("rejects out-of-range pagination", async () => {
    expect(
      await run(listProductsValidators, { query: { limit: "500" } }),
    ).toContain("limit");
  });

  it("requires at least one sale item with positive quantities", async () => {
    expect(
      await run(createSaleValidators, {
        body: { customerId: 1, items: [] },
      }),
    ).toContain("items");
    expect(
      await run(createSaleValidators, {
        body: { customerId: 1, items: [{ productId: 1, quantity: 0 }] },
      }),
    ).toContain("items[0].quantity");
  });

  it("requires a job type on submission", async () => {
    expect(await run(submitJobValidators, { body: {} })).toContain("jobType");
  });

  it("requires an integer adjustment quantity", async () => {
    expect(
      await run(adjustValidators, {
        params: { productId: "1" },
        body: { quantity: "many" },
      }),
    ).toContain("quantity");
  });
});
