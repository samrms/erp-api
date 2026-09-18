import { describe, it, expect, vi } from "vitest";
import { SaleService } from "../../../src/modules/sales/services/SaleService.js";
import { BusinessRuleError } from "../../../src/shared/errors/BusinessRuleError.js";
import { NotFoundError } from "../../../src/shared/errors/NotFoundError.js";

const CLIENT = { id: "tx-client" };

function makeService() {
  const saleRepo = {
    create: vi.fn(async ({ totalAmount }) => ({ id: 10, totalAmount })),
    createItem: vi.fn(async () => {}),
    findById: vi.fn(async () => null),
    findAll: vi.fn(async () => []),
  };
  const inventoryRepo = {
    getStock: vi.fn(async () => 100),
    deductStock: vi.fn(async () => ({})),
    createMovement: vi.fn(async () => {}),
  };
  const transactionManager = { run: vi.fn((cb) => cb(CLIENT)) };
  const productRepo = {
    findById: vi.fn(async (id) => ({ id, name: `P${id}`, price: "10.00" })),
  };
  const svc = new SaleService(
    saleRepo,
    inventoryRepo,
    transactionManager,
    productRepo,
  );
  return { svc, saleRepo, inventoryRepo, transactionManager, productRepo };
}

describe("SaleService.create", () => {
  it("computes totals, deducts stock, and persists sale plus items in one transaction", async () => {
    const { svc, saleRepo, inventoryRepo, productRepo } = makeService();
    const result = await svc.create({
      customerId: 1,
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    });

    expect(result).toMatchObject({ id: 10, totalAmount: 30 });
    // Products fetched once each (no N+1 re-fetch for line items)
    expect(productRepo.findById).toHaveBeenCalledTimes(2);
    // Stock checked and deducted inside the transaction client
    expect(inventoryRepo.getStock).toHaveBeenCalledWith(1, CLIENT);
    expect(inventoryRepo.deductStock).toHaveBeenCalledWith(1, 2, CLIENT);
    expect(inventoryRepo.createMovement).toHaveBeenCalledWith(
      {
        productId: 1,
        quantity: -2,
        movementType: "sale",
        reason: "Sale item",
      },
      CLIENT,
    );
    expect(saleRepo.create).toHaveBeenCalledWith(
      { customerId: 1, totalAmount: 30 },
      CLIENT,
    );
    expect(saleRepo.createItem).toHaveBeenCalledTimes(2);
    expect(saleRepo.createItem).toHaveBeenCalledWith(
      {
        saleId: 10,
        productId: 1,
        quantity: 2,
        unitPrice: "10.00",
        subtotal: 20,
      },
      CLIENT,
    );
  });

  it("rejects the whole sale when any item lacks stock, persisting nothing", async () => {
    const { svc, saleRepo, inventoryRepo } = makeService();
    inventoryRepo.getStock.mockResolvedValueOnce(1);
    await expect(
      svc.create({ customerId: 1, items: [{ productId: 1, quantity: 5 }] }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(saleRepo.create).not.toHaveBeenCalled();
    expect(saleRepo.createItem).not.toHaveBeenCalled();
    expect(inventoryRepo.deductStock).not.toHaveBeenCalled();
  });

  it("rejects unknown products with NotFoundError", async () => {
    const { svc, productRepo, saleRepo } = makeService();
    productRepo.findById.mockResolvedValue(null);
    await expect(
      svc.create({ customerId: 1, items: [{ productId: 999, quantity: 1 }] }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(saleRepo.create).not.toHaveBeenCalled();
  });

  it("propagates transaction failures to the caller", async () => {
    const { svc } = makeService();
    const boom = new Error("connection lost");
    svc.transactionManager.run.mockRejectedValueOnce(boom);
    await expect(
      svc.create({ customerId: 1, items: [{ productId: 1, quantity: 1 }] }),
    ).rejects.toBe(boom);
  });
});

describe("SaleService queries", () => {
  it("delegates findById and findAll to the repository", async () => {
    const { svc, saleRepo } = makeService();
    saleRepo.findById.mockResolvedValue({ id: 3 });
    await expect(svc.findById(3)).resolves.toEqual({ id: 3 });
    await svc.findAll({ limit: 5 });
    expect(saleRepo.findAll).toHaveBeenCalledWith({ limit: 5 });
  });
});
