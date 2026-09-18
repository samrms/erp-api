import { describe, it, expect, vi } from "vitest";
import { AuthService } from "../../../src/modules/auth/services/AuthService.js";
import { AuthenticationError } from "../../../src/shared/errors/AuthenticationError.js";
import { BusinessRuleError } from "../../../src/shared/errors/BusinessRuleError.js";

function makeService(overrides = {}) {
  const repo = {
    findByEmail: vi.fn(async () => null),
    findById: vi.fn(async () => null),
    create: vi.fn(async (data) => ({ id: 1, ...data })),
    updatePassword: vi.fn(async () => {}),
    ...overrides.repo,
  };
  const hasher = {
    hash: vi.fn(async (p) => `hash(${p})`),
    verify: vi.fn(async () => true),
    ...overrides.hasher,
  };
  const tokens = {
    sign: vi.fn(() => "signed-token"),
    verify: vi.fn(() => ({
      userId: 1,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })),
    ...overrides.tokens,
  };
  const store = { add: vi.fn(async () => {}), has: vi.fn(async () => false) };
  return {
    svc: new AuthService(repo, hasher, tokens, store),
    repo,
    hasher,
    tokens,
    store,
  };
}

describe("AuthService.register", () => {
  it("hashes the password and creates the user", async () => {
    const { svc, repo, hasher } = makeService();
    const result = await svc.register({
      email: "new@erp.com",
      password: "secret123",
      firstName: "Ada",
      lastName: "Lovelace",
    });
    expect(hasher.hash).toHaveBeenCalledWith("secret123");
    expect(repo.create).toHaveBeenCalledWith({
      email: "new@erp.com",
      passwordHash: "hash(secret123)",
      firstName: "Ada",
      lastName: "Lovelace",
    });
    expect(result.id).toBe(1);
  });

  it("never stores the plaintext password", async () => {
    const { svc, repo } = makeService();
    await svc.register({ email: "new@erp.com", password: "secret123" });
    const stored = repo.create.mock.calls[0][0];
    expect(stored.passwordHash).not.toBe("secret123");
    expect(stored).not.toHaveProperty("password");
  });

  it("translates a lost registration race (unique violation) into duplicate-email", async () => {
    const conflict = new Error(
      'duplicate key value violates unique constraint "users_email_key"',
    );
    conflict.code = "23505";
    const { svc } = makeService({
      repo: {
        create: async () => {
          throw conflict;
        },
      },
    });
    await expect(
      svc.register({ email: "race@erp.com", password: "secret123" }),
    ).rejects.toThrow("Email already exists");
  });

  it("rethrows non-conflict persistence failures", async () => {
    const { svc } = makeService({
      repo: {
        create: async () => {
          throw new Error("connection lost");
        },
      },
    });
    await expect(
      svc.register({ email: "x@erp.com", password: "secret123" }),
    ).rejects.toThrow("connection lost");
  });

  it("rejects an already-registered email", async () => {
    const { svc } = makeService({
      repo: { findByEmail: async () => ({ id: 9, email: "taken@erp.com" }) },
    });
    await expect(
      svc.register({ email: "taken@erp.com", password: "secret123" }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });
});

describe("AuthService.login", () => {
  const row = {
    id: 2,
    email: "a@b.com",
    password_hash: "hash(secret)",
    roles: ["admin"],
    permissions: ["product:read"],
  };

  it("returns a token embedding identity, roles, and permissions", async () => {
    const { svc, tokens, hasher } = makeService({
      repo: { findByEmail: async () => row },
    });
    const result = await svc.login({ email: "a@b.com", password: "secret" });
    expect(hasher.verify).toHaveBeenCalledWith("hash(secret)", "secret");
    expect(tokens.sign).toHaveBeenCalledWith({
      userId: 2,
      email: "a@b.com",
      roles: ["admin"],
      permissions: ["product:read"],
    });
    expect(result).toEqual({
      token: "signed-token",
      user: { id: 2, email: "a@b.com" },
    });
  });

  it("never exposes the password hash in the login response", async () => {
    const { svc } = makeService({ repo: { findByEmail: async () => row } });
    const result = await svc.login({ email: "a@b.com", password: "secret" });
    expect(JSON.stringify(result)).not.toContain("hash(secret)");
  });

  it("rejects unknown emails without revealing which check failed", async () => {
    const { svc, hasher } = makeService();
    const err = await svc
      .login({ email: "nobody@erp.com", password: "x" })
      .catch((e) => e);
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.message).toBe("Invalid credentials");
    expect(hasher.verify).not.toHaveBeenCalled();
  });

  it("rejects wrong passwords with the same message (no user enumeration)", async () => {
    const { svc } = makeService({
      repo: { findByEmail: async () => row },
      hasher: { verify: async () => false },
    });
    const err = await svc
      .login({ email: "a@b.com", password: "wrong" })
      .catch((e) => e);
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.message).toBe("Invalid credentials");
  });
});

describe("AuthService.logout", () => {
  it("blacklists the token until it expires", async () => {
    const { svc, store } = makeService();
    const result = await svc.logout("current-token");
    expect(result).toEqual({ message: "Logged out successfully" });
    expect(store.add).toHaveBeenCalledOnce();
    const [token, ttl] = store.add.mock.calls[0];
    expect(token).toBe("current-token");
    expect(ttl).toBeGreaterThan(0);
  });

  it("skips blacklisting an already-expired token", async () => {
    const { svc, store } = makeService({
      tokens: {
        verify: () => ({ userId: 1, exp: Math.floor(Date.now() / 1000) - 10 }),
      },
    });
    await svc.logout("expired-token");
    expect(store.add).not.toHaveBeenCalled();
  });
});

describe("AuthService.changePassword", () => {
  const user = { id: 5, email: "u@erp.com" };
  const full = { ...user, password_hash: "hash(old)" };

  function changeSetup() {
    return makeService({
      repo: {
        findById: async () => user,
        findByEmail: async () => full,
      },
    });
  }

  it("verifies the current password before updating", async () => {
    const { svc, repo, hasher } = changeSetup();
    const result = await svc.changePassword(5, {
      currentPassword: "old",
      newPassword: "newsecret",
    });
    expect(hasher.verify).toHaveBeenCalledWith("hash(old)", "old");
    expect(hasher.hash).toHaveBeenCalledWith("newsecret");
    expect(repo.updatePassword).toHaveBeenCalledWith(5, "hash(newsecret)");
    expect(result).toEqual({ message: "Password changed successfully" });
  });

  it("rejects a wrong current password without updating", async () => {
    const { svc, repo } = makeService({
      repo: { findById: async () => user, findByEmail: async () => full },
      hasher: { verify: async () => false },
    });
    await expect(
      svc.changePassword(5, {
        currentPassword: "nope",
        newPassword: "newsecret",
      }),
    ).rejects.toBeInstanceOf(AuthenticationError);
    expect(repo.updatePassword).not.toHaveBeenCalled();
  });

  it("rejects a short new password", async () => {
    const { svc, repo } = changeSetup();
    await expect(
      svc.changePassword(5, { currentPassword: "old", newPassword: "123" }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.updatePassword).not.toHaveBeenCalled();
  });

  it("rejects unknown users", async () => {
    const { svc } = makeService();
    await expect(
      svc.changePassword(99, {
        currentPassword: "old",
        newPassword: "newsecret",
      }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });
});
