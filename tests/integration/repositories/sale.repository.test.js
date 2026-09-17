import { describe, it, expect } from "vitest";
describe("sale repo", () => {
  it("parameterized", () =>
    expect(
      typeof require("../../../src/modules/sales/repositories/PostgresSaleRepository.js")
        .PostgresSaleRepository,
    ).toBe("function"));
});
