import { describe, it, expect } from "vitest";
import { LoginDto } from "../../../src/modules/auth/dto/LoginDto.js";
import { CreateSaleDto } from "../../../src/modules/sales/dto/CreateSaleDto.js";
describe("dto contracts", () => {
  it("LoginDto holds email", () => {
    const d = new LoginDto({ email: "a@b", password: "s" });
    expect(d.email).toBe("a@b");
  });
  it("CreateSaleDto validates", () => {
    expect(typeof CreateSaleDto).toBe("function");
  });
});
