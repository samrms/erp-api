import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class SaleItem extends BaseDomainModel {
  constructor({ id, saleId, productId, quantity, unitPrice, subtotal }) {
    super();
    this.id = id;
    this.saleId = saleId;
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = subtotal;
  }
}
