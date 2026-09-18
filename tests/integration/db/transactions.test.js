import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createIsolatedDb } from "../../setup/db.js";
import { TransactionManager } from "../../../src/infrastructure/database/TransactionManager.js";

let db;
let tm;

beforeAll(async () => {
  const isolated = await createIsolatedDb("db-transactions");
  db = isolated.database;
  db.closeDb = isolated.close;
  tm = new TransactionManager(db);
});

afterAll(async () => {
  if (db) await db.closeDb();
});

describe("TransactionManager against real PostgreSQL", () => {
  it("commits all writes atomically", async () => {
    const email = "committed@example.com";
    await tm.run(async (client) => {
      await client.query(
        "INSERT INTO customers (name, email) VALUES ($1, $2)",
        ["Committed", email],
      );
    });
    const res = await db.query("SELECT * FROM customers WHERE email = $1", [
      email,
    ]);
    expect(res.rows).toHaveLength(1);
  });

  it("rolls back every write when the callback throws", async () => {
    const email = "rolled-back@example.com";
    const boom = new Error("business failure");
    await expect(
      tm.run(async (client) => {
        await client.query(
          "INSERT INTO customers (name, email) VALUES ($1, $2)",
          ["Ghost", email],
        );
        throw boom;
      }),
    ).rejects.toBe(boom);
    const res = await db.query("SELECT * FROM customers WHERE email = $1", [
      email,
    ]);
    expect(res.rows).toHaveLength(0);
  });

  it("releases the client in both outcomes (pool stays usable)", async () => {
    await tm.run(async () => {});
    await expect(
      tm.run(async () => {
        throw new Error("x");
      }),
    ).rejects.toThrow("x");
    const res = await db.query("SELECT 1 AS ok");
    expect(res.rows[0].ok).toBe(1);
  });
});
