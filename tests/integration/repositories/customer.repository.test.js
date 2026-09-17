import { describe, it, expect } from "vitest";
describe("customer repo", () => {
  it("parameterized", () =>
    expect(
      typeof require("../../../src/modules/customers/repositories/PostgresCustomerRepository.js")
        .PostgresCustomerRepository,
    ).toBe("function"));
});
