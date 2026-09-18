import { describe, it, expect, vi } from "vitest";
import { body } from "express-validator";
import { validate } from "../../../src/shared/validation/validate.js";
import { ValidationError } from "../../../src/shared/errors/ValidationError.js";

async function runValidation(chains, bodyData) {
  const req = { body: bodyData };
  for (const chain of chains) {
    await chain.run(req);
  }
  return new Promise((resolve) => {
    validate(req, {}, (err) => resolve(err));
  });
}

describe("validate middleware", () => {
  it("passes valid input through with no error", async () => {
    const err = await runValidation(
      [body("email").isEmail(), body("password").isLength({ min: 6 })],
      { email: "a@b.com", password: "secret123" },
    );
    expect(err).toBeUndefined();
  });

  it("forwards a ValidationError with per-field details", async () => {
    const err = await runValidation(
      [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Too short"),
      ],
      { email: "not-an-email", password: "123" },
    );
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual([
      { field: "email", message: "Valid email is required" },
      { field: "password", message: "Too short" },
    ]);
  });

  it("never sends a response directly (delegates to the error handler)", async () => {
    const send = vi.fn();
    const req = { body: {} };
    await body("email").isEmail().run(req);
    validate(req, { status: () => ({ json: send }) }, () => {});
    expect(send).not.toHaveBeenCalled();
  });
});
