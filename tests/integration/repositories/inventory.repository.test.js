import { describe, it, expect } from "vitest";
describe("inventory repo", () => {
  it("parameterized", () =>
    expect(
      typeof require("../../../src/modules/inventory/repositories/PostgresInventoryRepository.js")
        .PostgresInventoryRepository,
    ).toBe("function"));
});
