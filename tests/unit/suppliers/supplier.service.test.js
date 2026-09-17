import { describe, it, expect } from "vitest";
import { SupplierService } from "../../../src/modules/suppliers/services/SupplierService.js";
describe("supplier service", () => {
  it("findAll delegates", async () => {
    const repo = { findAll: async () => [{ id: 1, name: "S" }] };
    expect(await new SupplierService(repo).findAll({})).toHaveLength(1);
  });
});
