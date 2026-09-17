import { BaseDomainModel } from '../../../shared/domain/BaseDomainModel.js';
export class InventoryMovement extends BaseDomainModel {
  constructor({ id, productId, quantity, movementType, reason, createdAt }) {
    super();
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.movementType = movementType;
    this.reason = reason;
    this.createdAt = createdAt;
  }
}
