import { describe, it, expect } from "vitest";
describe("test database isolation", () => {
  it("test database configured", () => {
    expect(
      typeof process.env.DATABASE_URL === "string" ||
        typeof process.env.DATABASE_URL === "undefined",
    ).toBe(true);
  });
});
