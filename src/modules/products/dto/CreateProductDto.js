export class CreateProductDto {
  constructor({ sku, name, description, price, cost }) {
    this.sku = sku
    this.name = name
    this.description = description
    this.price = price
    this.cost = cost
  }
}
