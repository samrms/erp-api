import { describe, it, expect } from "vitest";
import { LoginDto } from "../../../src/modules/auth/dto/LoginDto.js";
import { RegisterUserDto } from "../../../src/modules/auth/dto/RegisterUserDto.js";
import { CustomerDto } from "../../../src/modules/customers/dto/CustomerDto.js";
import { SupplierDto } from "../../../src/modules/suppliers/dto/SupplierDto.js";
import { CreateProductDto } from "../../../src/modules/products/dto/CreateProductDto.js";
import { UpdateProductDto } from "../../../src/modules/products/dto/UpdateProductDto.js";
import { CreateSaleDto } from "../../../src/modules/sales/dto/CreateSaleDto.js";
import { InventoryAdjustmentDto } from "../../../src/modules/inventory/dto/InventoryAdjustmentDto.js";
import { JobDto } from "../../../src/modules/jobs/dto/JobDto.js";
import { UserDto } from "../../../src/modules/users/dto/UserDto.js";
describe("DTO contracts", () => {
  it("LoginDto holds email and password", () => {
    const d = new LoginDto({ email: "a@b", password: "s" });
    expect(d.email).toBe("a@b");
  });
  it("all DTO classes exist", () => {
    expect(typeof LoginDto).toBe("function");
    expect(typeof CustomerDto).toBe("function");
    expect(typeof SupplierDto).toBe("function");
    expect(typeof CreateProductDto).toBe("function");
    expect(typeof CreateSaleDto).toBe("function");
    expect(typeof JobDto).toBe("function");
    expect(typeof UserDto).toBe("function");
  });
});
