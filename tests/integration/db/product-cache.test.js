import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createIsolatedDb } from "../../setup/db.js";
import { PostgresProductRepository } from "../../../src/modules/products/repositories/PostgresProductRepository.js";

function memoryCache() {
  const store = new Map();
  return {
    store,
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async set(key, value) {
      store.set(key, value);
    },
    async del(...keys) {
      for (const key of keys) store.delete(key);
    },
    async incr(key) {
      const next = Number(store.get(key) ?? 0) + 1;
      store.set(key, next);
      return next;
    },
  };
}

function countingDb(db) {
  let queries = 0;
  return {
    get count() {
      return queries;
    },
    async query(text, params) {
      queries += 1;
      return db.query(text, params);
    },
  };
}

let db;
let closeDb;
let counter = 0;

beforeAll(async () => {
  const isolated = await createIsolatedDb("db-product-cache");
  db = isolated.database;
  closeDb = isolated.close;
});

afterAll(async () => {
  if (closeDb) await closeDb();
});

describe("product catalog cache", () => {
  it("serves repeated findById from cache without touching the database", async () => {
    const counted = countingDb(db);
    const repo = new PostgresProductRepository(counted, memoryCache());
    const created = await repo.create({
      sku: `CACHE-${++counter}`,
      name: "Cached",
      price: "25.00",
    });

    const first = await repo.findById(created.id);
    const afterFirst = counted.count;
    const second = await repo.findById(created.id);
    expect(second).toEqual(first);
    expect(counted.count).toBe(afterFirst);
  });

  it("invalidates the item and listings after an update", async () => {
    const counted = countingDb(db);
    const repo = new PostgresProductRepository(counted, memoryCache());
    const created = await repo.create({
      sku: `INV-${++counter}`,
      name: "Stale?",
      price: "10.00",
    });

    await repo.findById(created.id);
    await repo.findAll({ limit: 5 });
    const cached = counted.count;

    await repo.update(created.id, { name: "Fresh" });
    const updated = await repo.findById(created.id);
    expect(updated.name).toBe("Fresh");
    expect(counted.count).toBeGreaterThan(cached);

    const listed = await repo.findAll({ limit: 5 });
    expect(listed.some((p) => p.id === created.id && p.name === "Fresh")).toBe(
      true,
    );
  });

  it("invalidates after deletion", async () => {
    const repo = new PostgresProductRepository(db, memoryCache());
    const created = await repo.create({
      sku: `DEL-${++counter}`,
      name: "Gone",
      price: "1.00",
    });
    expect(await repo.findById(created.id)).not.toBeNull();
    await repo.delete(created.id);
    expect(await repo.findById(created.id)).toBeNull();
  });

  it("behaves identically without a cache configured", async () => {
    const repo = new PostgresProductRepository(db);
    const created = await repo.create({
      sku: `NOCACHE-${++counter}`,
      name: `NoCache ${counter}`,
      price: "3.00",
    });
    expect(await repo.findById(created.id)).toMatchObject({ sku: created.sku });
    expect(await repo.findAll({ search: `NoCache ${counter}` })).toHaveLength(
      1,
    );
  });
});
