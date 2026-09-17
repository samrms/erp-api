import { describe, it, expect } from "vitest";
describe("auth middleware", () => {
  it("AuthMiddleware class exists", async () => {
    const mod =
      await import("../../../src/modules/auth/middleware/AuthMiddleware.js");
    expect(typeof mod.AuthMiddleware).toBe("function");
  });
});
