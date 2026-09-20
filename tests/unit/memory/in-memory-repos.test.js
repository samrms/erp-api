import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStore } from "../../../src/infrastructure/memory/InMemoryStore.js";
import { InMemoryTransactionManager } from "../../../src/infrastructure/memory/InMemoryTransactionManager.js";
import { InMemoryJobQueue } from "../../../src/infrastructure/memory/InMemoryJobQueue.js";
import { InMemoryAuthRepository } from "../../../src/modules/auth/repositories/InMemoryAuthRepository.js";
import { InMemoryUserRepository } from "../../../src/modules/users/repositories/InMemoryUserRepository.js";
import { InMemoryProductRepository } from "../../../src/modules/products/repositories/InMemoryProductRepository.js";
import { InMemoryCustomerRepository } from "../../../src/modules/customers/repositories/InMemoryCustomerRepository.js";
import { InMemorySupplierRepository } from "../../../src/modules/suppliers/repositories/InMemorySupplierRepository.js";
import { InMemoryInventoryRepository } from "../../../src/modules/inventory/repositories/InMemoryInventoryRepository.js";
import { InMemorySaleRepository } from "../../../src/modules/sales/repositories/InMemorySaleRepository.js";
import { InMemoryJobRepository } from "../../../src/modules/jobs/repositories/InMemoryJobRepository.js";

let store;

beforeEach(() => {
  store = new InMemoryStore();
});

describe("InMemoryStore", () => {
  it("starts with empty collections", () => {
    expect(store.users).toEqual([]);
    expect(store.products).toEqual([]);
    expect(store.customers).toEqual([]);
    expect(store.suppliers).toEqual([]);
    expect(store.inventory).toEqual([]);
    expect(store.sales).toEqual([]);
    expect(store.jobs).toEqual([]);
  });

  it("generates incrementing integer IDs per table", () => {
    expect(store._nextId("products")).toBe(1);
    expect(store._nextId("products")).toBe(2);
    expect(store._nextId("users")).toBe(1);
    expect(store._nextId("products")).toBe(3);
  });

  it("generates UUIDs", () => {
    const id = store._uuid();
    expect(typeof id).toBe("string");
    expect(id.length).toBe(36);
    expect(id).toContain("-");
  });

  it("returns a Date from _now", () => {
    expect(store._now()).toBeInstanceOf(Date);
  });
});

describe("InMemoryTransactionManager", () => {
  it("runs the callback and returns its result", async () => {
    const tm = new InMemoryTransactionManager();
    const result = await tm.run(async () => 42);
    expect(result).toBe(42);
  });

  it("propagates errors from the callback", async () => {
    const tm = new InMemoryTransactionManager();
    await expect(
      tm.run(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });
});

describe("InMemoryJobQueue", () => {
  it("adds jobs with incrementing IDs", async () => {
    const queue = new InMemoryJobQueue();
    const j1 = await queue.add("email", { to: "a@b.com" });
    const j2 = await queue.add("email", { to: "c@d.com" });
    expect(j1.id).toBe("stub-1");
    expect(j2.id).toBe("stub-2");
    expect(queue.jobs).toHaveLength(2);
    expect(queue.jobs[0]).toEqual({
      type: "email",
      payload: { to: "a@b.com" },
    });
  });

  it("close is a no-op", async () => {
    const queue = new InMemoryJobQueue();
    await expect(queue.close()).resolves.toBeUndefined();
  });
});

describe("InMemoryProductRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryProductRepository(store);
  });

  it("creates a product with UUID id and timestamps", async () => {
    const p = await repo.create({ sku: "W-001", name: "Widget", price: 9.99 });
    expect(p.id).toBeDefined();
    expect(p.sku).toBe("W-001");
    expect(p.name).toBe("Widget");
    expect(p.price).toBe("9.99");
    expect(p.created_at).toBeInstanceOf(Date);
    expect(store.products).toHaveLength(1);
  });

  it("defaults description to null", async () => {
    const p = await repo.create({ sku: "X-001", name: "Thing", price: 1 });
    expect(p.description).toBeNull();
  });

  it("stores description when provided", async () => {
    const p = await repo.create({
      sku: "X-002",
      name: "Thing",
      price: 1,
      description: "A thing",
    });
    expect(p.description).toBe("A thing");
  });

  it("finds a product by id", async () => {
    const created = await repo.create({
      sku: "F-001",
      name: "Find Me",
      price: 5,
    });
    const found = await repo.findById(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe("Find Me");
  });

  it("returns null for unknown id", async () => {
    expect(await repo.findById("nonexistent")).toBeNull();
  });

  it("lists all products with default limit 20", async () => {
    for (let i = 0; i < 25; i++) {
      await repo.create({ sku: `P-${i}`, name: `Product ${i}`, price: i });
    }
    const all = await repo.findAll();
    expect(all).toHaveLength(20);
  });

  it("respects limit and offset", async () => {
    for (let i = 0; i < 5; i++) {
      await repo.create({ sku: `P-${i}`, name: `Product ${i}`, price: i });
    }
    const page = await repo.findAll({ limit: 2, offset: 2 });
    expect(page).toHaveLength(2);
    expect(page[0].sku).toBe("P-2");
  });

  it("filters by search term", async () => {
    await repo.create({ sku: "A-1", name: "Alpha Widget", price: 1 });
    await repo.create({ sku: "A-2", name: "Beta Gadget", price: 2 });
    await repo.create({ sku: "A-3", name: "Alpha Tool", price: 3 });
    const results = await repo.findAll({ search: "alpha" });
    expect(results).toHaveLength(2);
  });

  it("updates product fields", async () => {
    const p = await repo.create({ sku: "U-001", name: "Old", price: 10 });
    const updated = await repo.update(p.id, { name: "New", price: 20 });
    expect(updated.name).toBe("New");
    expect(updated.price).toBe("20");
    expect(updated.updated_at.getTime()).toBeGreaterThanOrEqual(
      p.updated_at.getTime(),
    );
  });

  it("returns null when updating nonexistent product", async () => {
    expect(await repo.update("nope", { name: "X" })).toBeNull();
  });

  it("deletes a product", async () => {
    const p = await repo.create({ sku: "D-001", name: "Delete Me", price: 1 });
    await repo.delete(p.id);
    expect(await repo.findById(p.id)).toBeNull();
    expect(store.products).toHaveLength(0);
  });
});

describe("InMemoryCustomerRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryCustomerRepository(store);
  });

  it("creates a customer", async () => {
    const c = await repo.create({
      name: "Acme Corp",
      email: "a@acme.com",
      phone: "555-0100",
    });
    expect(c.id).toBeDefined();
    expect(c.name).toBe("Acme Corp");
    expect(c.email).toBe("a@acme.com");
    expect(c.phone).toBe("555-0100");
    expect(c.address).toBeNull();
  });

  it("finds a customer by id", async () => {
    const created = await repo.create({ name: "Find Me" });
    const found = await repo.findById(created.id);
    expect(found.name).toBe("Find Me");
  });

  it("returns null for unknown id", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("lists customers with limit and offset", async () => {
    for (let i = 0; i < 10; i++) {
      await repo.create({ name: `Customer ${i}` });
    }
    expect(await repo.findAll()).toHaveLength(10);
    const page = await repo.findAll({ limit: 3, offset: 5 });
    expect(page).toHaveLength(3);
  });

  it("filters by search", async () => {
    await repo.create({ name: "Acme Corp" });
    await repo.create({ name: "Beta Inc" });
    await repo.create({ name: "Acme Industries" });
    expect(await repo.findAll({ search: "acme" })).toHaveLength(2);
  });

  it("updates customer fields", async () => {
    const c = await repo.create({ name: "Old Name" });
    const updated = await repo.update(c.id, { name: "New Name" });
    expect(updated.name).toBe("New Name");
  });

  it("returns null when updating nonexistent customer", async () => {
    expect(await repo.update("nope", { name: "X" })).toBeNull();
  });

  it("deletes a customer", async () => {
    const c = await repo.create({ name: "Delete Me" });
    await repo.delete(c.id);
    expect(await repo.findById(c.id)).toBeNull();
  });
});

describe("InMemorySupplierRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemorySupplierRepository(store);
  });

  it("creates a supplier", async () => {
    const s = await repo.create({
      name: "Supplier Co",
      email: "s@sup.com",
      phone: "555-0200",
    });
    expect(s.id).toBeDefined();
    expect(s.name).toBe("Supplier Co");
    expect(s.email).toBe("s@sup.com");
    expect(s.phone).toBe("555-0200");
  });

  it("finds a supplier by id", async () => {
    const created = await repo.create({ name: "Find Me" });
    const found = await repo.findById(created.id);
    expect(found.name).toBe("Find Me");
  });

  it("returns null for unknown id", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("lists suppliers with limit and offset", async () => {
    for (let i = 0; i < 8; i++) {
      await repo.create({ name: `Supplier ${i}` });
    }
    expect(await repo.findAll()).toHaveLength(8);
    const page = await repo.findAll({ limit: 2, offset: 4 });
    expect(page).toHaveLength(2);
  });

  it("filters by search", async () => {
    await repo.create({ name: "Alpha Supply" });
    await repo.create({ name: "Beta Parts" });
    expect(await repo.findAll({ search: "alpha" })).toHaveLength(1);
  });

  it("updates supplier fields", async () => {
    const s = await repo.create({ name: "Old" });
    const updated = await repo.update(s.id, { name: "New" });
    expect(updated.name).toBe("New");
  });

  it("returns null when updating nonexistent supplier", async () => {
    expect(await repo.update("nope", { name: "X" })).toBeNull();
  });

  it("deletes a supplier", async () => {
    const s = await repo.create({ name: "Delete Me" });
    await repo.delete(s.id);
    expect(await repo.findById(s.id)).toBeNull();
  });
});

describe("InMemoryInventoryRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryInventoryRepository(store);
  });

  it("returns 0 stock for unknown product", async () => {
    expect(await repo.getStock("unknown")).toBe(0);
  });

  it("setStock creates inventory entry", async () => {
    await repo.setStock("prod-1", 100);
    expect(await repo.getStock("prod-1")).toBe(100);
    expect(store.inventory).toHaveLength(1);
  });

  it("setStock updates existing entry", async () => {
    await repo.setStock("prod-1", 100);
    await repo.setStock("prod-1", 50);
    expect(await repo.getStock("prod-1")).toBe(50);
    expect(store.inventory).toHaveLength(1);
  });

  it("adjustStock increases quantity", async () => {
    await repo.setStock("prod-1", 10);
    const result = await repo.adjustStock("prod-1", 5);
    expect(result).toBe(15);
  });

  it("adjustStock creates entry when increasing from 0", async () => {
    const result = await repo.adjustStock("prod-1", 10);
    expect(result).toBe(10);
  });

  it("adjustStock decreases quantity", async () => {
    await repo.setStock("prod-1", 10);
    const result = await repo.adjustStock("prod-1", -3);
    expect(result).toBe(7);
  });

  it("adjustStock throws on insufficient stock for negative delta", async () => {
    await repo.setStock("prod-1", 2);
    await expect(repo.adjustStock("prod-1", -5)).rejects.toThrow(
      "Insufficient stock",
    );
  });

  it("deductStock reduces quantity", async () => {
    await repo.setStock("prod-1", 20);
    await repo.deductStock("prod-1", 8);
    expect(await repo.getStock("prod-1")).toBe(12);
  });

  it("deductStock throws on insufficient stock", async () => {
    await repo.setStock("prod-1", 3);
    await expect(repo.deductStock("prod-1", 5)).rejects.toThrow(
      "Insufficient stock",
    );
  });

  it("deductStock throws when no inventory entry", async () => {
    await expect(repo.deductStock("unknown", 1)).rejects.toThrow(
      "Insufficient stock",
    );
  });

  it("creates an inventory movement", async () => {
    await repo.createMovement({
      productId: "prod-1",
      quantity: 50,
      movementType: "restock",
      reason: "Initial stock",
    });
    expect(store.inventoryMovements).toHaveLength(1);
    expect(store.inventoryMovements[0].product_id).toBe("prod-1");
    expect(store.inventoryMovements[0].quantity).toBe(50);
    expect(store.inventoryMovements[0].movement_type).toBe("restock");
  });
});

describe("InMemoryAuthRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryAuthRepository(store);
  });

  it("creates a user and returns without password hash", async () => {
    const u = await repo.create({
      email: "test@example.com",
      passwordHash: "hashedpw",
      firstName: "Test",
      lastName: "User",
    });
    expect(u.id).toBeDefined();
    expect(u.email).toBe("test@example.com");
    expect(u.first_name).toBe("Test");
    expect(u.last_name).toBe("User");
    expect(u).not.toHaveProperty("password_hash");
  });

  it("throws on duplicate email (simulated unique constraint)", async () => {
    await repo.create({ email: "dup@test.com", passwordHash: "x" });
    await expect(
      repo.create({ email: "dup@test.com", passwordHash: "y" }),
    ).rejects.toThrow("duplicate key");
  });

  it("finds user by email with roles and permissions", async () => {
    store.roles.push({ id: 1, name: "admin" });
    store.userRoles.push({ user_id: "u1", role_id: 1 });
    store.permissions.push({ id: 10, code: "product:read" });
    store.rolePermissions.push({ role_id: 1, permission_id: 10 });
    store.users.push({
      id: "u1",
      email: "admin@test.com",
      password_hash: "x",
      first_name: "A",
      last_name: "B",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const found = await repo.findByEmail("admin@test.com");
    expect(found.roles).toEqual(["admin"]);
    expect(found.permissions).toEqual(["product:read"]);
  });

  it("findByEmail returns null for unknown email", async () => {
    expect(await repo.findByEmail("nobody@test.com")).toBeNull();
  });

  it("finds user by id without password hash", async () => {
    store.users.push({
      id: "u2",
      email: "u2@test.com",
      password_hash: "secret",
      first_name: "U",
      last_name: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const found = await repo.findById("u2");
    expect(found.email).toBe("u2@test.com");
    expect(found).not.toHaveProperty("password_hash");
  });

  it("findById returns null for unknown id", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("updates password hash", async () => {
    store.users.push({
      id: "u3",
      email: "u3@test.com",
      password_hash: "old",
      first_name: "U",
      last_name: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await repo.updatePassword("u3", "newhash");
    expect(store.users[0].password_hash).toBe("newhash");
  });

  it("updatePassword is a no-op for unknown user", async () => {
    await expect(repo.updatePassword("nope", "x")).resolves.toBeUndefined();
  });
});

describe("InMemoryUserRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryUserRepository(store);
  });

  it("lists users without password hashes", async () => {
    store.users.push({
      id: "u1",
      email: "a@test.com",
      password_hash: "secret",
      first_name: "A",
      last_name: "B",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const users = await repo.findAll();
    expect(users).toHaveLength(1);
    expect(users[0]).not.toHaveProperty("password_hash");
    expect(users[0].email).toBe("a@test.com");
  });

  it("finds user by id with roles", async () => {
    store.roles.push({ id: 1, name: "admin" });
    store.userRoles.push({ user_id: "u1", role_id: 1 });
    store.users.push({
      id: "u1",
      email: "a@test.com",
      password_hash: "x",
      first_name: "A",
      last_name: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const user = await repo.findById("u1");
    expect(user.roles).toEqual(["admin"]);
  });

  it("findById returns null for unknown id", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("finds role by name", async () => {
    store.roles.push({ id: 1, name: "admin" });
    store.roles.push({ id: 2, name: "viewer" });
    expect(await repo.findRoleByName("admin")).toEqual({
      id: 1,
      name: "admin",
    });
    expect(await repo.findRoleByName("nobody")).toBeNull();
  });

  it("assigns role to user", async () => {
    const result = await repo.assignRole("u1", 1);
    expect(result).toBe(true);
    expect(store.userRoles).toHaveLength(1);
    expect(store.userRoles[0]).toEqual({ user_id: "u1", role_id: 1 });
  });

  it("returns false when role already assigned", async () => {
    await repo.assignRole("u1", 1);
    const result = await repo.assignRole("u1", 1);
    expect(result).toBe(false);
    expect(store.userRoles).toHaveLength(1);
  });

  it("filters users by search", async () => {
    store.users.push(
      {
        id: "u1",
        email: "admin@test.com",
        password_hash: "x",
        first_name: "A",
        last_name: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "u2",
        email: "user@test.com",
        password_hash: "x",
        first_name: "U",
        last_name: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    );
    const results = await repo.findAll({ search: "admin" });
    expect(results).toHaveLength(1);
    expect(results[0].email).toBe("admin@test.com");
  });
});

describe("InMemorySaleRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemorySaleRepository(store);
  });

  it("creates a sale", async () => {
    const sale = await repo.create({ customerId: "c1", totalAmount: 150.5 });
    expect(sale.id).toBeDefined();
    expect(sale.customer_id).toBe("c1");
    expect(sale.total_amount).toBe("150.5");
    expect(sale.created_at).toBeInstanceOf(Date);
    expect(store.sales).toHaveLength(1);
  });

  it("creates sale items", async () => {
    const sale = await repo.create({ customerId: "c1", totalAmount: 100 });
    await repo.createItem({
      saleId: sale.id,
      productId: "p1",
      quantity: 2,
      unitPrice: 25,
      subtotal: 50,
    });
    await repo.createItem({
      saleId: sale.id,
      productId: "p2",
      quantity: 1,
      unitPrice: 50,
      subtotal: 50,
    });
    expect(store.saleItems).toHaveLength(2);
    expect(store.saleItems[0].sale_id).toBe(sale.id);
    expect(store.saleItems[0].unit_price).toBe("25");
  });

  it("finds sale by id", async () => {
    const created = await repo.create({ customerId: "c1", totalAmount: 10 });
    const found = await repo.findById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("returns null for unknown sale", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("lists sales with limit and offset", async () => {
    for (let i = 0; i < 5; i++) {
      await repo.create({ customerId: "c1", totalAmount: i * 10 });
    }
    const all = await repo.findAll();
    expect(all).toHaveLength(5);
    const page = await repo.findAll({ limit: 2, offset: 1 });
    expect(page).toHaveLength(2);
  });
});

describe("InMemoryJobRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryJobRepository(store);
  });

  it("creates a job with pending status", async () => {
    const job = await repo.create({
      jobType: "email",
      payload: { to: "a@b.com" },
    });
    expect(job.id).toBeDefined();
    expect(job.job_type).toBe("email");
    expect(job.status).toBe("pending");
    expect(job.attempts).toBe(0);
    expect(job.error).toBeNull();
  });

  it("finds job by id", async () => {
    const created = await repo.create({ jobType: "report" });
    const found = await repo.findById(created.id);
    expect(found.job_type).toBe("report");
  });

  it("returns null for unknown job", async () => {
    expect(await repo.findById("nope")).toBeNull();
  });

  it("updates job status", async () => {
    const job = await repo.create({ jobType: "email" });
    await repo.updateStatus(job.id, "completed");
    const updated = await repo.findById(job.id);
    expect(updated.status).toBe("completed");
  });

  it("updates job status with error", async () => {
    const job = await repo.create({ jobType: "email" });
    await repo.updateStatus(job.id, "failed", "SMTP timeout");
    const updated = await repo.findById(job.id);
    expect(updated.status).toBe("failed");
    expect(updated.error).toBe("SMTP timeout");
  });

  it("updateStatus is a no-op for unknown job", async () => {
    await expect(repo.updateStatus("nope", "done")).resolves.toBeUndefined();
  });
});
