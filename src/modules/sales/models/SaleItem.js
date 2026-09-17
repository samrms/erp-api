import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class SaleItem extends BaseDomainModel {
  constructor({ id, saleId, productId, quantity, unitPrice, subtotal }) {
    super({ id });
    this.saleId = saleId;
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = subtotal;
  }
  validate() {
    if (!this.saleId) throw new Error("Sale ID is required");
    if (this.quantity <= 0) throw new Error("Quantity must be positive");
    return true;
  }
  toJSON() {
    return { id: this.id, saleId: this.saleId, productId: this.productId, quantity: this.quantity, unitPrice: this.unitPrice, subtotal: this.subtotal, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
