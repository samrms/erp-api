import { BaseDomainModel } from "../../../shared/domain/BaseDomainModel.js";
export class AuthUser extends BaseDomainModel {
  constructor({ id, email, role }) {
    super();
    this.id = id;
    this.email = email;
    this.role = role;
  }
}
