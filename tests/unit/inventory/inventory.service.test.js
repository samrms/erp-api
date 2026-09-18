import { describe, it, expect, vi } from "vitest";
import { InventoryService } from "../../../src/modules/inventory/services/InventoryService.js";

function makeService(overrides = {}) {
  const repo = {
    getStock: vi.fn(async () => 42),
    adjustStock: vi.fn(async () => 47),
    createMovement: vi.fn(async () => {}),
    ...overrides,
  };
  return { svc: new InventoryService(repo), repo };
}

describe("InventoryService", () => {
  it("returns current stock for a product", async () => {
    const { svc } = makeService();
    await expect(svc.getStock(1)).resolves.toBe(42);
  });

  it("adjusts stock relatively and returns product plus quantity", async () => {
    const { svc, repo } = makeService();
    await expect(svc.adjustStock(1, 5)).resolves.toEqual({
      productId: 1,
      quantity: 47,
    });
    expect(repo.adjustStock).toHaveBeenCalledWith(1, 5);
  });

  it("records a movement and echoes the input", async () => {
    const { svc, repo } = makeService();
    const movement = {
      productId: 1,
      quantity: 10,
      movementType: "restock",
      reason: "shipment",
    };
    await expect(svc.createMovement(movement)).resolves.toEqual(movement);
    expect(repo.createMovement).toHaveBeenCalledWith(movement);
  });
});
