export class UserDto {
  constructor({ email, password, role }) {
    this.email = email
    this.password = password
    this.role = role
  }
}
