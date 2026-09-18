import { describe, it, expect, vi } from "vitest";
import { ErrorHandler } from "../../../src/app/ErrorHandler.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { NotFoundError } from "../../../src/shared/errors/NotFoundError.js";
import { ValidationError } from "../../../src/shared/errors/ValidationError.js";

function run(handler, err, path = "/test") {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  handler.handle(err, { path, method: "GET", id: "req-1" }, res, () => {});
  return res;
}

describe("ErrorHandler", () => {
  it("maps AppError to its status code and envelope", () => {
    const res = run(
      new ErrorHandler({ isDevelopment: false }),
      new AppError("test", 400, "TEST"),
    );
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { code: "TEST", message: "test", requestId: "req-1" },
    });
  });

  it("includes validation details in the envelope", () => {
    const res = run(
      new ErrorHandler({ isDevelopment: false }),
      new ValidationError("Validation failed", [
        { field: "email", message: "Invalid email" },
      ]),
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.error.details).toEqual([
      { field: "email", message: "Invalid email" },
    ]);
  });

  it("masks unexpected errors in production (no leak)", () => {
    const res = run(
      new ErrorHandler({ isDevelopment: false }),
      new Error("SELECT * FROM users -- secret"),
    );
    expect(res.statusCode).toBe(500);
    expect(res.body.error.code).toBe("INTERNAL_ERROR");
    expect(res.body.error.message).toBe("Internal server error");
    expect(res.body.error.message).not.toContain("SELECT");
    expect(res.body.error.stack).toBeUndefined();
  });

  it("reveals unexpected error messages in development", () => {
    const res = run(
      new ErrorHandler({ isDevelopment: true }),
      new Error("db exploded"),
    );
    expect(res.statusCode).toBe(500);
    expect(res.body.error.message).toBe("db exploded");
    expect(typeof res.body.error.stack).toBe("string");
  });

  it("honors framework status codes (malformed JSON is a 400, not a 500)", () => {
    const parseError = new SyntaxError("Unexpected token } in JSON");
    parseError.status = 400;
    parseError.type = "entity.parse.failed";
    const res = run(new ErrorHandler({ isDevelopment: false }), parseError);
    expect(res.statusCode).toBe(400);
    // Message still masked outside development
    expect(res.body.error.message).toBe("Internal server error");
  });

  it("defaults requestId when the request has none", () => {
    const res = { statusCode: null, body: null };
    const handler = new ErrorHandler({ isDevelopment: false });
    const fakeRes = {
      status(code) {
        res.statusCode = code;
        return fakeRes;
      },
      json(body) {
        res.body = body;
      },
    };
    handler.handle(
      new NotFoundError("Product", 7),
      { path: "/" },
      fakeRes,
      () => {},
    );
    expect(res.statusCode).toBe(404);
    expect(res.body.error.requestId).toBe("-");
  });

  it("logs unexpected errors without throwing", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      run(new ErrorHandler({ isDevelopment: false }), new Error("x"));
      expect(spy).toHaveBeenCalledOnce();
    } finally {
      spy.mockRestore();
    }
  });
});
