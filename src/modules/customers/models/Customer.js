import { BaseDomainModel } from "../../../../shared/domain/BaseDomainModel.js";
export class Customer extends BaseDomainModel {
  constructor({ id, name, email, phone, address }) {
    super({ id });
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }
  validate() {
    if (!this.name) throw new Error("Name is required");
    return true;
  }
  toJSON() {
    return { id: this.id, name: this.name, email: this.email, phone: this.phone, address: this.address, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
