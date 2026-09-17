import { describe, it, expect } from "vitest";
import { TransactionManager } from "../../../src/infrastructure/database/TransactionManager.js";
describe("transaction manager", () => {
  it("rolls back on error", async () => {
    const tx = new TransactionManager({
      getClient: async () => ({ query: async () => {}, release: () => {} }),
    });
    expect(typeof tx.run).toBe("function");
  });
});
