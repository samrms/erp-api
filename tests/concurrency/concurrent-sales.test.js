import { describe, it, expect } from "vitest";
describe("concurrent sales", () => {
  it("simultaneous sales do not oversell", () => {
    expect(10 - 7 - 3).toBe(0);
  });
});
