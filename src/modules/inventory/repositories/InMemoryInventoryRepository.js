import { BusinessRuleError } from "../../../shared/errors/BusinessRuleError.js";

export class InMemoryInventoryRepository {
  constructor(store) {
    this.store = store;
  }

  async getStock(productId) {
    const inv = this.store.inventory.find((i) => i.product_id === productId);
    return inv ? inv.quantity : 0;
  }

  async setStock(productId, quantity) {
    const inv = this.store.inventory.find((i) => i.product_id === productId);
    if (inv) {
      inv.quantity = quantity;
      inv.updated_at = this.store._now();
    } else {
      this.store.inventory.push({
        id: this.store._uuid(),
        product_id: productId,
        quantity,
        updated_at: this.store._now(),
      });
    }
  }

  async deductStock(productId, quantity) {
    const inv = this.store.inventory.find((i) => i.product_id === productId);
    if (!inv || inv.quantity < quantity) {
      throw new BusinessRuleError(
        "Insufficient stock for product " + productId,
      );
    }
    inv.quantity -= quantity;
    inv.updated_at = this.store._now();
    return inv;
  }

  async adjustStock(productId, delta) {
    if (delta > 0) {
      const inv = this.store.inventory.find((i) => i.product_id === productId);
      if (inv) {
        inv.quantity += delta;
        inv.updated_at = this.store._now();
      } else {
        this.store.inventory.push({
          id: this.store._uuid(),
          product_id: productId,
          quantity: delta,
          updated_at: this.store._now(),
        });
      }
    } else if (delta < 0) {
      const inv = this.store.inventory.find((i) => i.product_id === productId);
      if (!inv || inv.quantity + delta < 0) {
        throw new BusinessRuleError(
          "Insufficient stock for product " + productId,
        );
      }
      inv.quantity += delta;
      inv.updated_at = this.store._now();
    }
    return this.getStock(productId);
  }

  async createMovement({ productId, quantity, movementType, reason }) {
    this.store.inventoryMovements.push({
      id: this.store._uuid(),
      product_id: productId,
      quantity,
      movement_type: movementType,
      reason: reason || null,
      created_at: this.store._now(),
    });
  }
}
