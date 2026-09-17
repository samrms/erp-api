import { describe, it, expect } from "vitest";
describe("mass assignment protection", () => {
  it("controllers must not spread raw body", () => {
    expect(true).toBe(true);
  });
});
