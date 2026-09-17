import { describe, it, expect } from "vitest";
import { ApplicationContainer } from "../../../src/app/ApplicationContainer.js";
describe("ApplicationContainer", () => {
  it("constructs dependency graph", () => {
    process.env.JWT_SECRET = "testsecret";
    const container = new ApplicationContainer();
    expect(container.authController).toBeDefined();
    expect(container.productController).toBeDefined();
    expect(container.saleController).toBeDefined();
    delete process.env.JWT_SECRET;
  });
});
