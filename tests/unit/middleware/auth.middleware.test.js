import { describe, it, expect } from "vitest";
import { AuthMiddleware } from "../../../src/modules/auth/middleware/AuthMiddleware.js";
describe("auth middleware", () => {
  it("bind creates handler", () => {
    const mw = new AuthMiddleware({ verify: () => ({ userId: 1 }) });
    expect(typeof mw.handle).toBe("function");
  });
  it("passes with token", async () => {
    const mw = new AuthMiddleware({ verify: () => ({ userId: 99 }) });
    await new Promise((r) =>
      mw.handle({ headers: { authorization: "Bearer x" } }, {}, r),
    );
  });
});
