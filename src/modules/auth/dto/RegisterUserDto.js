export class RegisterUserDto {
  constructor({ email, password, roles = [] }) {
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
