import { describe, it, expect, vi } from "vitest";
import { AuthMiddleware } from "../../../src/modules/auth/middleware/AuthMiddleware.js";
import { AuthenticationError } from "../../../src/shared/errors/AuthenticationError.js";

function run(mw, headers) {
  return new Promise((resolve) => {
    const req = { headers };
    const res = {};
    mw.handle(req, res, (err) => resolve({ req, err }));
  });
}

function makeMiddleware() {
  const tokenProvider = {
    verify: vi.fn(() => ({ userId: 7, permissions: [] })),
  };
  const tokenStore = { has: vi.fn(async () => false) };
  return {
    mw: new AuthMiddleware(tokenProvider, tokenStore),
    tokenProvider,
    tokenStore,
  };
}

describe("AuthMiddleware", () => {
  it("attaches the verified payload and raw token to the request", async () => {
    const { mw } = makeMiddleware();
    const { req, err } = await run(mw, { authorization: "Bearer abc.def" });
    expect(err).toBeUndefined();
    expect(req.user).toEqual({ userId: 7, permissions: [] });
    expect(req.token).toBe("abc.def");
  });

  it("rejects a missing token", async () => {
    const { mw } = makeMiddleware();
    const { err } = await run(mw, {});
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.statusCode).toBe(401);
  });

  it("rejects an empty bearer value", async () => {
    const { mw } = makeMiddleware();
    const { err } = await run(mw, { authorization: "Bearer " });
    expect(err).toBeInstanceOf(AuthenticationError);
  });

  it("maps provider failures (tampered/expired/wrong-secret) to 401, never 500", async () => {
    const { mw, tokenProvider } = makeMiddleware();
    tokenProvider.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });
    const { err, req } = await run(mw, { authorization: "Bearer stale" });
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Invalid token");
    expect(req.user).toBeUndefined();
  });

  it("rejects revoked tokens (logout blacklist)", async () => {
    const { mw, tokenStore } = makeMiddleware();
    tokenStore.has.mockResolvedValue(true);
    const { err } = await run(mw, { authorization: "Bearer revoked" });
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.message).toBe("Token has been revoked");
  });

  it("works without a token store configured", async () => {
    const mw = new AuthMiddleware({ verify: () => ({ userId: 1 }) }, null);
    const { err, req } = await run(mw, { authorization: "Bearer x" });
    expect(err).toBeUndefined();
    expect(req.user).toEqual({ userId: 1 });
  });
});
