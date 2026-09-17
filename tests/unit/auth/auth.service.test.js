import { describe, it, expect } from "vitest";
import { AuthService } from "../../../src/modules/auth/services/AuthService.js";
describe("auth service", () => {
  it("register creates user when email new", async () => {
    const repo = {
      findByEmail: async () => null,
      create: async (e, h) => ({ id: 1, email: e, password_hash: h }),
    };
    const svc = new AuthService(
      repo,
      { hash: async (p) => "hash_" + p },
      { sign: () => "t" },
    );
    const r = await svc.register({ email: "test@erp.com", password: "secret" });
    expect(r.id).toBe(1);
    expect(r.email).toBe("test@erp.com");
  });
  it("login returns token", async () => {
    const repo = {
      findByEmail: async () => ({
        id: 2,
        email: "a@b.com",
        password_hash: "hash_s",
      }),
    };
    const svc = new AuthService(
      repo,
      { verify: async () => true },
      { sign: () => "t" },
    );
    const r = await svc.login({ email: "a@b.com", password: "s" });
    expect(r.token).toBe("t");
  });
});
