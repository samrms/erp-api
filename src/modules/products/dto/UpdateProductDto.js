export class UpdateProductDto {
  constructor({ name, description, price, cost, active }) {
    this.name = name
    this.description = description
    this.price = price
    this.cost = cost
    this.active = active
  }
}
