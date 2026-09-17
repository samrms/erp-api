import { describe, it, expect } from "vitest";
describe("error middleware", () => {
  it("exists", () => {
    expect(
      typeof require("../../../src/app/ErrorHandler.js").ErrorHandler,
    ).toBe("function");
  });
});
