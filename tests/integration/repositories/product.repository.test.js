import { describe, it, expect } from "vitest";
describe("product repo", () => {
  it("parameterized", () =>
    expect(
      typeof require("../../../src/modules/products/repositories/PostgresProductRepository.js")
        .PostgresProductRepository,
    ).toBe("function"));
});
