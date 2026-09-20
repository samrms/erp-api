import { config } from "dotenv";
config();

export class Config {
  constructor() {
    this.nodeEnv = process.env.NODE_ENV || "development";
    this.port = parseInt(process.env.PORT || "3000", 10);
    this.databaseUrl =
      process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
    this.redisUrl = process.env.REDIS_URL || "";
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtIssuer = process.env.JWT_ISSUER || "erp-api";
    this.jwtAudience = process.env.JWT_AUDIENCE || "erp-api";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";
    this.allowedOrigin = process.env.ALLOWED_ORIGIN || "";
    if (!this.jwtSecret) throw new Error("JWT_SECRET required");
  }

  get isDevelopment() {
    return this.nodeEnv === "development";
  }

  get isTest() {
    return this.nodeEnv === "test";
  }

  get isProduction() {
    return this.nodeEnv === "production";
  }
}
