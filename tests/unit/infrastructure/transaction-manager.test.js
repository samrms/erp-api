import { describe, it, expect, vi } from "vitest";
import { TransactionManager } from "../../../src/infrastructure/database/TransactionManager.js";

function makeManager() {
  const queries = [];
  const client = {
    query: vi.fn(async (sql) => {
      queries.push(sql);
      return { rows: [] };
    }),
    release: vi.fn(),
  };
  const database = { getClient: vi.fn(async () => client) };
  return { tm: new TransactionManager(database), client, queries, database };
}

describe("TransactionManager", () => {
  it("commits on success and always releases the client", async () => {
    const { tm, client, queries } = makeManager();
    const result = await tm.run(async (c) => {
      expect(c).toBe(client);
      await c.query("INSERT ...");
      return "ok";
    });
    expect(result).toBe("ok");
    expect(queries).toEqual(["BEGIN", "INSERT ...", "COMMIT"]);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("rolls back on failure, rethrows the original error, and releases", async () => {
    const { tm, client, queries } = makeManager();
    const boom = new Error("constraint violation");
    const err = await tm
      .run(async () => {
        throw boom;
      })
      .catch((e) => e);
    expect(err).toBe(boom);
    expect(queries).toEqual(["BEGIN", "ROLLBACK"]);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("releases the client even when commit itself fails", async () => {
    const { tm, client } = makeManager();
    client.query.mockImplementation(async (sql) => {
      if (sql === "COMMIT") throw new Error("commit failed");
      return { rows: [] };
    });
    await expect(tm.run(async () => "x")).rejects.toThrow("commit failed");
    expect(client.release).toHaveBeenCalledOnce();
  });
});
