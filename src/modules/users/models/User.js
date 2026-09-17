import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class User extends BaseDomainModel {
  constructor({ id, email, passwordHash, roles = [], permissions = [] }) {
    super({ id });
    this.email = email;
    this.passwordHash = passwordHash;
    this.roles = roles;
    this.permissions = permissions;
  }
  validate() {
    if (!this.email) throw new Error("Email is required");
    return true;
  }
  toJSON() {
    return { id: this.id, email: this.email, roles: this.roles, permissions: this.permissions, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
