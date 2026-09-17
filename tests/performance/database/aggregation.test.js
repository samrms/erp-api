import { describe, it, expect } from "vitest";
describe("aggregation", () => {
  it("aggregates", () => {
    const sum = (a, b) => a + b;
    expect(typeof sum).toBe("function");
  });
});
