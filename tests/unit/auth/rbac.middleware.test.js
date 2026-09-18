import { describe, it, expect } from "vitest";
import { RBACMiddleware } from "../../../src/modules/auth/middleware/RBACMiddleware.js";
import { AuthorizationError } from "../../../src/shared/errors/AuthorizationError.js";

function run(permission, user) {
  const mw = new RBACMiddleware();
  return new Promise((resolve) => {
    mw.handle(permission)({ user }, {}, (err) => resolve(err));
  });
}

describe("RBACMiddleware", () => {
  it("allows a request carrying the required permission", async () => {
    const err = await run("product:read", {
      permissions: ["product:read", "sale:read"],
    });
    expect(err).toBeUndefined();
  });

  it("denies a request missing the permission with a 403", async () => {
    const err = await run("product:read", { permissions: ["sale:read"] });
    expect(err).toBeInstanceOf(AuthorizationError);
    expect(err.statusCode).toBe(403);
  });

  it("denies requests with no user or no permissions array", async () => {
    expect(await run("product:read", undefined)).toBeInstanceOf(
      AuthorizationError,
    );
    expect(await run("product:read", {})).toBeInstanceOf(AuthorizationError);
  });
});
