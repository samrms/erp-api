export class RegisterUserDto {
  constructor({ email, password, firstName, lastName, roles = [] } = {}) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = roles;
  }
}
