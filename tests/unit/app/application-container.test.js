import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ApplicationContainer } from "../../../src/app/ApplicationContainer.js";

const savedSecret = process.env.JWT_SECRET;

beforeEach(() => {
  process.env.JWT_SECRET = "container-test-secret";
});

afterEach(() => {
  if (savedSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = savedSecret;
});

describe("ApplicationContainer", () => {
  it("wires the full dependency graph", async () => {
    const c = await new ApplicationContainer().init();
    try {
      expect(c.authService.authRepository).toBe(c.authRepo);
      expect(c.authService.passwordHasher).toBe(c.passwordHasher);
      expect(c.authService.tokenProvider).toBe(c.tokenProvider);
      expect(c.authService.tokenStore).toBe(c.tokenStore);
      expect(c.authController.authService).toBe(c.authService);
      expect(c.saleService.inventoryRepo).toBe(c.inventoryRepo);
      expect(c.saleService.productRepo).toBe(c.productRepo);
      expect(c.saleService.transactionManager).toBe(c.transactionManager);
      expect(c.saleController.saleService).toBe(c.saleService);
      expect(c.jobService.repo).toBe(c.jobRepo);
      expect(c.jobService.queue).toBe(c.queue);
      expect(c.authMiddleware.tokenProvider).toBe(c.tokenProvider);
      expect(c.authMiddleware.tokenStore).toBe(c.tokenStore);
    } finally {
      await c.tokenStore.close();
      if (c.database) await c.database.close();
    }
  });
});
