import { describe, it, expect } from "vitest";
import { Argon2PasswordHasher } from "../../../src/infrastructure/security/Argon2PasswordHasher.js";

describe("Argon2PasswordHasher", () => {
  const hasher = new Argon2PasswordHasher();

  it("hashes and verifies the same password", async () => {
    const hash = await hasher.hash("correct-horse");
    expect(await hasher.verify(hash, "correct-horse")).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hasher.hash("correct-horse");
    expect(await hasher.verify(hash, "wrong-battery")).toBe(false);
  });

  it("salts hashes so identical passwords differ", async () => {
    const a = await hasher.hash("same");
    const b = await hasher.hash("same");
    expect(a).not.toBe(b);
    expect(a).not.toContain("same");
  });
});
