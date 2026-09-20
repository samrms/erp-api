import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Config } from "../../../src/config/Config.js";

const MANAGED = [
  "PORT",
  "DATABASE_URL",
  "TEST_DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
  "JWT_EXPIRES_IN",
  "NODE_ENV",
];
const saved = {};
for (const key of MANAGED) saved[key] = process.env[key];

beforeEach(() => {
  for (const key of MANAGED) delete process.env[key];
  process.env.JWT_SECRET = "test-secret";
});

afterEach(() => {
  for (const key of MANAGED) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("Config", () => {
  it("applies documented defaults", () => {
    delete process.env.PORT;
    delete process.env.JWT_ISSUER;
    const config = new Config();
    expect(config.port).toBe(3000);
    expect(config.jwtIssuer).toBe("erp-api");
    expect(config.jwtAudience).toBe("erp-api");
    expect(config.jwtExpiresIn).toBe("1h");
    expect(config.redisUrl).toBe("");
  });

  it("reads overrides from the environment", () => {
    process.env.PORT = "4001";
    process.env.DATABASE_URL = "postgres://localhost:5432/custom";
    process.env.JWT_ISSUER = "issuer";
    const config = new Config();
    expect(config.port).toBe(4001);
    expect(config.databaseUrl).toBe("postgres://localhost:5432/custom");
    expect(config.jwtIssuer).toBe("issuer");
  });

  it("refuses to boot without a JWT secret", () => {
    delete process.env.JWT_SECRET;
    expect(() => new Config()).toThrow("JWT_SECRET required");
  });

  it("exposes environment flags", () => {
    process.env.NODE_ENV = "test";
    expect(new Config().isTest).toBe(true);
    expect(new Config().isProduction).toBe(false);
    process.env.NODE_ENV = "production";
    expect(new Config().isProduction).toBe(true);
  });
});
