import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class Sale extends BaseDomainModel {
  constructor({ id, customerId, totalAmount, createdAt }) {
    super({ id, createdAt });
    this.customerId = customerId;
    this.totalAmount = totalAmount;
  }
  validate() {
    if (!this.customerId) throw new Error("Customer ID is required");
    if (this.totalAmount < 0) throw new Error("Total amount cannot be negative");
    return true;
  }
  toJSON() {
    return { id: this.id, customerId: this.customerId, totalAmount: this.totalAmount, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
