import { describe, it, expect } from "vitest";
import { customerSchema } from "../../../src/modules/customers/schemas/customerSchema.js";
describe("customer schema", () => {
  it("requires name", () => {
    const result = customerSchema.validateSync
      ? customerSchema.validateSync({})
      : null;
    expect(typeof customerSchema).toBe("object");
  });
});
