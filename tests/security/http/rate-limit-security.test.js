import { describe, it, expect } from "vitest";
describe("rate limit", () => {
  it("express-rate-limit available", () => {
    expect(typeof require("express-rate-limit")).toBe("function");
  });
});
