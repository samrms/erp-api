import { BaseDomainModel } from '../../../shared/domain/BaseDomainModel.js'
export class Product extends BaseDomainModel {
  constructor({ id, sku, name, description, price }) {
    super()
    if (price < 0) throw new Error('Price cannot be negative')
    this.id = id
    this.sku = sku
    this.name = name
    this.description = description
    this.price = price
  }
}
