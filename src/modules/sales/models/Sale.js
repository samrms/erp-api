import { BaseDomainModel } from '../../../shared/domain/BaseDomainModel.js';
export class Sale extends BaseDomainModel {
  constructor({ id, customerId, totalAmount, createdAt }) {
    super();
    this.id = id; this.customerId = customerId; this.totalAmount = totalAmount; this.createdAt = createdAt;
  }
}
