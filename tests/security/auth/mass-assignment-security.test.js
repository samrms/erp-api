import { describe, it, expect } from "vitest";
describe("mass assignment security", () => {
  it("controllers do not blindly spread request body", () => {
    const files = [
      "src/modules/auth/controllers/AuthController.js",
      "src/modules/products/controllers/ProductController.js",
      "src/modules/customers/controllers/CustomerController.js",
      "src/modules/suppliers/controllers/SupplierController.js",
      "src/modules/sales/controllers/SaleController.js",
      "src/modules/jobs/controllers/JobController.js",
    ];
    for (const f of files) {
      const content = require("fs").readFileSync(f, "utf8");
      expect(content).not.toContain("Object.assign");
    }
  });
});
