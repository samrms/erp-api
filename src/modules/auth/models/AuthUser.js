import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class AuthUser extends BaseDomainModel {
  constructor({ id, email, role }) {
    super({ id });
    this.email = email;
    this.role = role;
  }
  validate() {
    if (!this.email) throw new Error("Email is required");
    return true;
  }
  toJSON() {
    return { id: this.id, email: this.email, role: this.role, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
