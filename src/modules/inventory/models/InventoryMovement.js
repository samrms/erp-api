export class InventoryMovement {
  constructor({
    id,
    productId,
    type,
    quantity,
    reason,
    referenceId,
    createdAt,
  }) {
    this.id = id
    this.productId = productId
    this.type = type
    this.quantity = quantity
    this.reason = reason
    this.referenceId = referenceId
    this.createdAt = createdAt
  }
}
