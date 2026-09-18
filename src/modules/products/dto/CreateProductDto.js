export class CreateProductDto {
  constructor({ sku, name, description, price } = {}) {
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
