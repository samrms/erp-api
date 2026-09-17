export class UserDto {
  constructor({ id, email, roles, permissions }) {
    this.id = id;
    this.email = email;
    this.roles = roles || [];
    this.permissions = permissions || [];
  }
}
