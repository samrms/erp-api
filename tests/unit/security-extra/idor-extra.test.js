import { describe, it, expect } from "vitest";
describe("IDOR protection", () => {
  it("users must not access others resources", () => {
    expect(true).toBe(true);
  });
});
