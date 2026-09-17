import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class User extends BaseDomainModel {
  constructor({ id, email, passwordHash, roles = [], permissions = [] }) {
    super();
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roles = roles;
    this.permissions = permissions;
  }
}
