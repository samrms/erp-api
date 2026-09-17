import { describe, it, expect } from "vitest";
describe("isolation", () => {
  it("isolated", () => expect(typeof "isolation").toBe("string"));
});
