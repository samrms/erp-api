import { describe, it, expect } from "vitest";
import { PostgresDatabase } from "../../../src/infrastructure/database/PostgresDatabase.js";
describe("database", () => {
  it("exists", () => {
    expect(typeof PostgresDatabase).toBe("function");
  });
});
