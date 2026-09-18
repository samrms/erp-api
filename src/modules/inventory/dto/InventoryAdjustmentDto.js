export class InventoryAdjustmentDto {
  constructor({ productId, quantity, reason } = {}) {
    this.productId = productId;
    this.quantity = quantity;
    this.reason = reason;
  }
}
