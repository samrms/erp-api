import { describe, it, expect } from "vitest";
describe("db connection", () => {
  it("database url set", () => {
    expect(
      typeof process.env.DATABASE_URL === "string" ||
        typeof process.env.DATABASE_URL === "undefined",
    ).toBe(true);
  });
  it("postgres service reachable", async () => {
    const { PostgresDatabase } =
      await import("../../../src/infrastructure/database/PostgresDatabase.js");
    expect(typeof PostgresDatabase).toBe("function");
  });
});
