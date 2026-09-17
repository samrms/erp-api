export class Sale {
  constructor({ id, customerId, userId, status, total, createdAt }) {
    this.id = id
    this.customerId = customerId
    this.userId = userId
    this.status = status || 'pending'
    this.total = total
    this.createdAt = createdAt
  }
}
