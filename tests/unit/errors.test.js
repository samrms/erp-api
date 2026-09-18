import { describe, it, expect } from "vitest";
import { AppError } from "../../src/shared/errors/AppError.js";
import { ValidationError } from "../../src/shared/errors/ValidationError.js";
import { AuthenticationError } from "../../src/shared/errors/AuthenticationError.js";
import { AuthorizationError } from "../../src/shared/errors/AuthorizationError.js";
import { NotFoundError } from "../../src/shared/errors/NotFoundError.js";
import { ConflictError } from "../../src/shared/errors/ConflictError.js";
import { BusinessRuleError } from "../../src/shared/errors/BusinessRuleError.js";

describe("AppError", () => {
  it("is an Error with status, code, and operational flag", () => {
    const err = new AppError("boom", 503, "UNAVAILABLE");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AppError");
    expect(err.message).toBe("boom");
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe("UNAVAILABLE");
    expect(err.isOperational).toBe(true);
  });

  it("defaults to a 500 APP_ERROR", () => {
    const err = new AppError("boom");
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe("APP_ERROR");
  });

  it("serializes to the API error envelope", () => {
    expect(new AppError("boom", 503, "X").toJSON()).toEqual({
      error: { code: "X", message: "boom" },
    });
  });
});

describe("error subclasses", () => {
  it("ValidationError carries field details", () => {
    const details = [{ field: "email", message: "Invalid email" }];
    const err = new ValidationError("Validation failed", details);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.toJSON()).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    });
  });

  it("ValidationError defaults to an empty details array", () => {
    expect(new ValidationError().details).toEqual([]);
  });

  it("AuthenticationError is a 401", () => {
    const err = new AuthenticationError("Invalid credentials");
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("AUTHENTICATION_ERROR");
  });

  it("AuthorizationError is a 403", () => {
    const err = new AuthorizationError("Requires product:read");
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("AUTHORIZATION_ERROR");
  });

  it("NotFoundError formats resource and id", () => {
    expect(new NotFoundError("Product", 42).message).toBe(
      "Product 42 not found",
    );
    expect(new NotFoundError("Product").message).toBe("Product not found");
    expect(new NotFoundError("Product", 42).statusCode).toBe(404);
  });

  it("ConflictError is a 409", () => {
    const err = new ConflictError("Email already exists");
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe("CONFLICT");
  });

  it("BusinessRuleError is a 422", () => {
    const err = new BusinessRuleError("Insufficient stock");
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe("BUSINESS_RULE_VIOLATION");
  });

  it("all subclasses are operational AppErrors", () => {
    for (const err of [
      new ValidationError(),
      new AuthenticationError(),
      new AuthorizationError(),
      new NotFoundError(),
      new ConflictError(),
      new BusinessRuleError(),
    ]) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.isOperational).toBe(true);
    }
  });
});
