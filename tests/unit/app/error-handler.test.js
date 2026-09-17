import { describe, it, expect } from "vitest";
describe("error handler", () => {
  it("handles AppError with status", async () => {
    const { AppError } = await import("../../../src/shared/errors/AppError.js");
    const e = new AppError("test", 400, "TEST");
    expect(e.statusCode).toBe(400);
    expect(e.code).toBe("TEST");
  });
});
