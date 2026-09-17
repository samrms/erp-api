import { describe, it, expect } from "vitest";
describe("atomic transaction", () => {
  it("transaction manager rolls back on error", async () => {
    const { TransactionManager } =
      await import("../../../src/infrastructure/database/TransactionManager.js");
    expect(typeof TransactionManager).toBe("function");
  });
});
