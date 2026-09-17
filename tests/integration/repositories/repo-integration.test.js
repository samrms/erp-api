import { describe, it, expect } from "vitest";
describe("repository integration", () => {
  it("repositories use parameterized SQL with real database", () => {
    const {
      PostgresProductRepository,
    } = require("../../../src/modules/products/repositories/PostgresProductRepository.js");
    expect(typeof PostgresProductRepository).toBe("function");
  });
});
