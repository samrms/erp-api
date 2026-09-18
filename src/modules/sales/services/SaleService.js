import { BusinessRuleError } from "../../../shared/errors/BusinessRuleError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { BaseService } from "../../../shared/http/BaseService.js";
export class SaleService extends BaseService {
  constructor(saleRepo, inventoryRepo, transactionManager, productRepo) {
    super();
    this.saleRepo = saleRepo;
    this.inventoryRepo = inventoryRepo;
    this.transactionManager = transactionManager;
    this.productRepo = productRepo;
  }

  async create({ customerId, items }) {
    return this.transactionManager.run(async (client) => {

      const productIds = items.map((item) => item.productId);
      const products = [];
      for (const id of productIds) {
        const product = await this.productRepo.findById(id);
        if (!product) {
          throw new NotFoundError("Product", id);
        }
        products.push(product);
      }

      let total = 0;
      const itemDetails = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const product = products[i];
        const stock = await this.inventoryRepo.getStock(item.productId, client);
        if (stock < item.quantity) {
          throw new BusinessRuleError(
            "Insufficient stock for " +
              product.name +
              ": requested " +
              item.quantity +
              ", available " +
              stock,
          );
        }
        const subtotal = item.quantity * Number(product.price);
        total += subtotal;
        itemDetails.push({ product, item, subtotal });
      }

      for (const { item } of itemDetails) {
        await this.inventoryRepo.deductStock(
          item.productId,
          item.quantity,
          client,
        );
        await this.inventoryRepo.createMovement(
          {
            productId: item.productId,
            quantity: -item.quantity,
            movementType: "sale",
            reason: "Sale item",
          },
          client,
        );
      }

      const sale = await this.saleRepo.create(
        { customerId, totalAmount: total },
        client,
      );

      for (const { product, item, subtotal } of itemDetails) {
        await this.saleRepo.createItem(
          {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal,
          },
          client,
        );
      }

      return sale;
    });
  }

  async findById(id) {
    return this.saleRepo.findById(id);
  }

  async findAll(query) {
    return this.saleRepo.findAll(query);
  }
}
