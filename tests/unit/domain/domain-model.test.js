import { describe, it, expect } from "vitest";
import { BaseDomainModel } from "../../../src/shared/domain/BaseDomainModel.js";
describe("domain model", () => {
  it("assigns init", () => {
    const m = new BaseDomainModel({ name: "test" });
    expect(m.name).toBe("test");
  });
});
