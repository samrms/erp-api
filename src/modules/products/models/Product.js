import { BaseDomainModel } from "../../../../shared/domain/BaseDomainModel.js";
export class Product extends BaseDomainModel {
  constructor({ id, sku, name, description, price }) {
    super({ id });
    if (price < 0) throw new Error("Price cannot be negative");
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.price = price;
  }
  validate() {
    if (!this.name) throw new Error("Name is required");
    if (this.price < 0) throw new Error("Price cannot be negative");
    return true;
  }
  toJSON() {
    return { id: this.id, sku: this.sku, name: this.name, description: this.description, price: this.price, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
