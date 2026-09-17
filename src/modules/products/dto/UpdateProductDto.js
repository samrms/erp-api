export class UpdateProductDto {
  constructor({ name, description, price }) {
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
