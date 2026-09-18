import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createIsolatedDb } from "../../setup/db.js";
import { PostgresAuthRepository } from "../../../src/modules/auth/repositories/PostgresAuthRepository.js";
import { PostgresProductRepository } from "../../../src/modules/products/repositories/PostgresProductRepository.js";
import { PostgresInventoryRepository } from "../../../src/modules/inventory/repositories/PostgresInventoryRepository.js";
import { PostgresSaleRepository } from "../../../src/modules/sales/repositories/PostgresSaleRepository.js";
import { PostgresJobRepository } from "../../../src/modules/jobs/repositories/PostgresJobRepository.js";
import { BusinessRuleError } from "../../../src/shared/errors/BusinessRuleError.js";

let db;
let auth;
let products;
let inventory;
let sales;
let jobs;
let counter = 0;
const email = () => `repo-${++counter}@example.com`;

beforeAll(async () => {
  const isolated = await createIsolatedDb("db-repositories");
  db = isolated.database;
  db.closeDb = isolated.close;
  auth = new PostgresAuthRepository(db);
  products = new PostgresProductRepository(db);
  inventory = new PostgresInventoryRepository(db);
  sales = new PostgresSaleRepository(db);
  jobs = new PostgresJobRepository(db);
});

afterAll(async () => {
  if (db) await db.closeDb();
});

describe("PostgresAuthRepository", () => {
  it("creates a user and finds it by email with roles defaulting to empty", async () => {
    const created = await auth.create({
      email: email(),
      passwordHash: "hash-1",
      firstName: "Ada",
      lastName: "L",
    });
    expect(created.id).toBeDefined();
    expect(created).not.toHaveProperty("password_hash");

    const found = await auth.findByEmail(created.email);
    expect(found.id).toBe(created.id);
    expect(found.roles).toEqual([]);
    expect(found.permissions).toEqual([]);
  });

  it("returns null for unknown emails", async () => {
    expect(await auth.findByEmail("ghost@example.com")).toBeNull();
  });

  it("rejects duplicate emails at the database level", async () => {
    const dup = email();
    await auth.create({ email: dup, passwordHash: "h", firstName: "A" });
    await expect(
      auth.create({ email: dup, passwordHash: "h", firstName: "B" }),
    ).rejects.toThrow(/duplicate|unique/i);
  });

  it("updates the password hash", async () => {
    const created = await auth.create({
      email: email(),
      passwordHash: "old-hash",
      firstName: "Grace",
    });
    await auth.updatePassword(created.id, "new-hash");
    const found = await auth.findByEmail(created.email);
    expect(found.password_hash).toBe("new-hash");
  });
});

describe("PostgresProductRepository", () => {
  it("creates, reads, updates, and deletes a product", async () => {
    const created = await products.create({
      sku: `SKU-${++counter}`,
      name: "Widget",
      description: "d",
      price: "29.99",
    });
    expect(created.id).toBeDefined();

    expect(await products.findById(created.id)).toMatchObject({
      sku: created.sku,
      name: "Widget",
    });
    expect(await products.findById(999999)).toBeNull();

    const updated = await products.update(created.id, {
      name: "Widget Pro",
      price: "39.99",
    });
    expect(updated.name).toBe("Widget Pro");

    await products.delete(created.id);
    expect(await products.findById(created.id)).toBeNull();
  });

  it("ignores disallowed columns on update (injection/mass-assignment safe)", async () => {
    const created = await products.create({
      sku: `SKU-${++counter}`,
      name: "Safe",
      price: "10.00",
    });
    const updated = await products.update(created.id, {
      id: 999999,
      sku: "HACKED",
      "name; DROP TABLE products; --": "x",
      name: "Still Safe",
    });
    expect(updated.id).toBe(created.id);
    expect(updated.sku).toBe(created.sku);
    expect(updated.name).toBe("Still Safe");
    // Table survived the attempt
    expect(await products.findById(created.id)).not.toBeNull();
  });

  it("leaves untouched columns alone on sparse updates", async () => {
    const created = await products.create({
      sku: `SPARSE-${++counter}`,
      name: "Sparse",
      description: "keep me",
      price: "99.99",
    });
    const updated = await products.update(created.id, {
      name: "Sparse Renamed",
      description: undefined,
      price: undefined,
    });
    expect(updated.name).toBe("Sparse Renamed");
    expect(updated.description).toBe("keep me");
    expect(updated.price).toBe("99.99");
  });

  it("paginates, searches, and falls back to a safe sort on hostile input", async () => {
    for (let i = 0; i < 5; i++) {
      await products.create({
        sku: `PAGE-${counter}-${i}`,
        name: `Paginated ${counter} ${i}`,
        price: `${i + 1}.00`,
      });
    }
    const page = await products.findAll({ limit: "2", offset: "0" });
    expect(page).toHaveLength(2);
    const searched = await products.findAll({ search: `Paginated ${counter}` });
    expect(searched.length).toBeGreaterThanOrEqual(5);
    const hostile = await products.findAll({
      sortField: "id; DROP TABLE products; --",
      sortOrder: "desc; SELECT 1",
    });
    expect(Array.isArray(hostile)).toBe(true);
    expect(await products.findAll({})).not.toHaveLength(0);
  });
});

describe("PostgresInventoryRepository", () => {
  it("reports zero stock for unknown products", async () => {
    expect(await inventory.getStock(424242)).toBe(0);
  });

  it("sets, deducts atomically, and refuses to go negative", async () => {
    const product = await products.create({
      sku: `INV-${++counter}`,
      name: "Stocked",
      price: "5.00",
    });
    await inventory.setStock(product.id, 10);
    expect(await inventory.getStock(product.id)).toBe(10);

    await inventory.deductStock(product.id, 4);
    expect(await inventory.getStock(product.id)).toBe(6);

    await expect(inventory.deductStock(product.id, 7)).rejects.toBeInstanceOf(
      BusinessRuleError,
    );
    expect(await inventory.getStock(product.id)).toBe(6);
  });

  it("adjusts relatively in both directions and records movements", async () => {
    const product = await products.create({
      sku: `ADJ-${++counter}`,
      name: "Adjustable",
      price: "5.00",
    });
    expect(await inventory.adjustStock(product.id, 8)).toBe(8);
    expect(await inventory.adjustStock(product.id, -3)).toBe(5);
    await expect(inventory.adjustStock(product.id, -6)).rejects.toBeInstanceOf(
      BusinessRuleError,
    );
    expect(await inventory.getStock(product.id)).toBe(5);

    await inventory.createMovement({
      productId: product.id,
      quantity: 8,
      movementType: "restock",
      reason: "shipment",
    });
    const movements = await db.query(
      "SELECT * FROM inventory_movements WHERE product_id = $1",
      [product.id],
    );
    expect(movements.rows).toHaveLength(1);
    expect(movements.rows[0].movement_type).toBe("restock");
  });
});

describe("PostgresSaleRepository", () => {
  it("creates sales with items and lists newest first", async () => {
    const customer = await db.query(
      "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *",
      [`Buyer ${++counter}`, `buyer-${counter}@example.com`],
    );
    const product = await products.create({
      sku: `SALE-${counter}`,
      name: "Sellable",
      price: "12.50",
    });
    const sale = await sales.create({
      customerId: customer.rows[0].id,
      totalAmount: 25,
    });
    await sales.createItem({
      saleId: sale.id,
      productId: product.id,
      quantity: 2,
      unitPrice: "12.50",
      subtotal: 25,
    });
    expect(await sales.findById(sale.id)).toMatchObject({ id: sale.id });
    expect(await sales.findById(999999)).toBeNull();
    const all = await sales.findAll({ limit: 10, offset: 0 });
    expect(all[0].id).toBe(sale.id);
  });
});

describe("PostgresJobRepository", () => {
  it("tracks a job from pending to completed", async () => {
    const record = await jobs.create({
      jobType: "report",
      payload: { format: "pdf" },
    });
    expect(record.status).toBe("pending");
    expect(record.payload).toEqual({ format: "pdf" });

    await jobs.updateStatus(record.id, "completed");
    expect(await jobs.findById(record.id)).toMatchObject({
      status: "completed",
    });
    expect(await jobs.findById(999999)).toBeNull();
  });
});
