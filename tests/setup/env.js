process.env.NODE_ENV ??= "test";
process.env.JWT_SECRET ??= "test-secret-do-not-use-in-production";
process.env.JWT_ISSUER ??= "erp-api-test";
process.env.JWT_AUDIENCE ??= "erp-api-test";
process.env.JWT_EXPIRES_IN ??= "1h";
process.env.REDIS_URL ??= "redis://localhost:6379";
