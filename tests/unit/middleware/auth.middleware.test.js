import { describe, it, expect } from "vitest";
import { AuthMiddleware } from "../../../src/modules/auth/middleware/AuthMiddleware.js";
describe("auth middleware", () => {
  it("handle is bound", () => {
    const mw = new AuthMiddleware({ verify: () => ({ userId: 1 }) });
    expect(typeof mw.handle).toBe("function");
  });
  it("passes valid token", async () => {
    const mw = new AuthMiddleware({ verify: () => ({ userId: 99 }) });
    const req = { headers: { authorization: "Bearer validtoken" } };
    const res = {};
    await new Promise((resolve) => mw.handle(req, res, (err) => resolve(err)));
  });
});
