import { describe, it, expect } from "vitest";
import { LoginDto } from "../../../src/modules/auth/dto/LoginDto.js";
import { RegisterUserDto } from "../../../src/modules/auth/dto/RegisterUserDto.js";
import { CreateProductDto } from "../../../src/modules/products/dto/CreateProductDto.js";
import { UpdateProductDto } from "../../../src/modules/products/dto/UpdateProductDto.js";
import { CustomerDto } from "../../../src/modules/customers/dto/CustomerDto.js";
import { SupplierDto } from "../../../src/modules/suppliers/dto/SupplierDto.js";
import { InventoryAdjustmentDto } from "../../../src/modules/inventory/dto/InventoryAdjustmentDto.js";
import { CreateSaleDto } from "../../../src/modules/sales/dto/CreateSaleDto.js";
import { JobDto } from "../../../src/modules/jobs/dto/JobDto.js";
import { UserDto } from "../../../src/modules/users/dto/UserDto.js";
import { PromoteUserDto } from "../../../src/modules/users/dto/PromoteUserDto.js";

describe("DTOs whitelist request input", () => {
  it("CreateProductDto drops unknown fields", () => {
    const dto = new CreateProductDto({
      sku: "A-1",
      name: "Widget",
      price: 10,
      isAdmin: true,
      id: 999,
    });
    expect(dto).toEqual({
      sku: "A-1",
      name: "Widget",
      description: undefined,
      price: 10,
    });
  });

  it("UpdateProductDto never carries identifiers", () => {
    const dto = new UpdateProductDto({ id: 1, sku: "X", name: "N" });
    expect(dto).toEqual({
      name: "N",
      description: undefined,
      price: undefined,
    });
  });

  it("CustomerDto and SupplierDto pick contact fields only", () => {
    expect(
      new CustomerDto({ name: "A", email: "a@b.c", role: "admin" }),
    ).toEqual({
      name: "A",
      email: "a@b.c",
      phone: undefined,
      address: undefined,
    });
    expect(new SupplierDto({ name: "S", password_hash: "x" })).toEqual({
      name: "S",
      email: undefined,
      phone: undefined,
    });
  });

  it("RegisterUserDto defaults roles to an empty array", () => {
    const dto = new RegisterUserDto({ email: "a@b.c", password: "secret123" });
    expect(dto.roles).toEqual([]);
    expect(dto).not.toHaveProperty("passwordHash");
  });

  it("LoginDto carries credentials only", () => {
    expect(new LoginDto({ email: "a@b.c", password: "p", token: "t" })).toEqual(
      {
        email: "a@b.c",
        password: "p",
      },
    );
  });

  it("CreateSaleDto normalizes each item to product and quantity", () => {
    const dto = new CreateSaleDto({
      customerId: 3,
      items: [{ productId: 1, quantity: 2, unitPrice: 999, injected: true }],
    });
    expect(dto).toEqual({
      customerId: 3,
      items: [{ productId: 1, quantity: 2 }],
    });
  });

  it("CreateSaleDto tolerates a missing items array", () => {
    expect(new CreateSaleDto({ customerId: 1 }).items).toEqual([]);
  });

  it("JobDto defaults payload to an empty object", () => {
    expect(new JobDto({ jobType: "report" })).toEqual({
      jobType: "report",
      payload: {},
    });
  });

  it("InventoryAdjustmentDto carries adjustment fields", () => {
    expect(
      new InventoryAdjustmentDto({
        productId: 1,
        quantity: -5,
        reason: "sale",
      }),
    ).toEqual({ productId: 1, quantity: -5, reason: "sale" });
  });

  it("UserDto defaults roles and permissions and never carries secrets", () => {
    const dto = new UserDto({ id: 1, email: "a@b.c", password_hash: "x" });
    expect(dto.roles).toEqual([]);
    expect(dto.permissions).toEqual([]);
    expect(dto).not.toHaveProperty("password_hash");
  });

  it("PromoteUserDto carries the role only", () => {
    expect(new PromoteUserDto({ role: "admin", userId: 999 })).toEqual({
      role: "admin",
    });
  });

  it("DTOs accept empty input without throwing (validation happens in schemas)", () => {
    expect(() => new CreateProductDto()).not.toThrow();
    expect(() => new CreateSaleDto()).not.toThrow();
    expect(() => new JobDto()).not.toThrow();
  });
});
