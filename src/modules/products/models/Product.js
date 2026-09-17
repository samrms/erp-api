export class Product {
  #price
  #cost

  constructor({ id, sku, name, description, price, cost, active }) {
    this.id = id
    this.sku = sku
    this.name = name
    this.description = description || null
    this.active = active !== false
    this.setPrice(price)
    this.setCost(cost)
  }

  setPrice(price) {
    if (price < 0) throw new Error('Price cannot be negative')
    this.#price = Number(price)
  }

  getPrice() {
    return this.#price
  }

  setCost(cost) {
    if (cost < 0) throw new Error('Cost cannot be negative')
    this.#cost = Number(cost)
  }

  getCost() {
    return this.#cost
  }

  isActive() {
    return this.active
  }
}
