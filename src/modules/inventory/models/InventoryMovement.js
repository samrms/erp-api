import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class InventoryMovement extends BaseDomainModel {
  constructor({ id, productId, quantity, movementType, reason, createdAt }) {
    super({ id, createdAt });
    this.productId = productId;
    this.quantity = quantity;
    this.movementType = movementType;
    this.reason = reason;
  }
  validate() {
    if (!this.productId) throw new Error("Product ID is required");
    return true;
  }
  toJSON() {
    return { id: this.id, productId: this.productId, quantity: this.quantity, movementType: this.movementType, reason: this.reason, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
