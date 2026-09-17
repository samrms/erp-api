import { BaseDomainModel } from "../../../../shared/domain/BaseDomainModel.js";
export class Supplier extends BaseDomainModel {
  constructor({ id, name, email, phone }) {
    super({ id });
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
  validate() {
    if (!this.name) throw new Error("Name is required");
    return true;
  }
  toJSON() {
    return { id: this.id, name: this.name, email: this.email, phone: this.phone, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
