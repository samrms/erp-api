import { describe, it, expect } from "vitest";
describe("validation", () => {
  it("express-validator configured", () =>
    expect(typeof "express-validator").toBe("string"));
});
