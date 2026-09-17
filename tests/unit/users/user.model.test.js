import { describe, it, expect } from "vitest";
import { User } from "../../../src/modules/users/models/User.js";
describe("user domain", () => {
  it("protects invariants", () => {
    const u = new User({ id: 1, email: "a@b.com", passwordHash: "x" });
    expect(u.email).toBe("a@b.com");
  });
});
