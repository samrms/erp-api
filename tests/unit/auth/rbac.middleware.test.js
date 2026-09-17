import { describe, it, expect } from "vitest";
import { RBACMiddleware } from "../../../src/modules/auth/middleware/RBACMiddleware.js";
describe("rbac middleware", () => {
  it("denies without permission", () => {
    const mw = new RBACMiddleware();
    const handler = mw.handle("product:create");
    const req = { user: { permissions: [] } };
    let denied = false;
    handler(req, {}, (e) => {
      if (e) denied = true;
    });
    expect(denied).toBe(true);
  });
  it("allows with permission", () => {
    const mw = new RBACMiddleware();
    const handler = mw.handle("product:create");
    const req = { user: { permissions: ["product:create"] } };
    let allowed = false;
    handler(req, {}, () => {
      allowed = true;
    });
    expect(allowed).toBe(true);
  });
});
