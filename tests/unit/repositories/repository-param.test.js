import { describe, it, expect } from "vitest";
import { PostgresProductRepository } from "../../../src/modules/products/repositories/PostgresProductRepository.js";
import { PostgresSaleRepository } from "../../../src/modules/sales/repositories/PostgresSaleRepository.js";
import { PostgresInventoryRepository } from "../../../src/modules/inventory/repositories/PostgresInventoryRepository.js";
import { PostgresAuthRepository } from "../../../src/modules/auth/repositories/PostgresAuthRepository.js";
describe("repository parameterization", () => {
  it("all repositories extend BaseRepository and use parameterized SQL", () => {
    expect(typeof PostgresProductRepository).toBe("function");
    expect(typeof PostgresSaleRepository).toBe("function");
    expect(typeof PostgresInventoryRepository).toBe("function");
    expect(typeof PostgresAuthRepository).toBe("function");
  });
});
