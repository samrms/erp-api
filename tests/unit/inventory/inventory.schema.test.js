import { describe, it, expect } from "vitest";
import { inventorySchema } from "../../../src/modules/inventory/schemas/inventorySchema.js";
describe("inventory schema", () => {
  it("exists", () => {
    expect(typeof inventorySchema).toBe("object");
  });
});
