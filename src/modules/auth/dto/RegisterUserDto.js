export class RegisterUserDto {
  constructor({ email, password, role }) {
    this.email = email
    this.password = password
    this.role = role || 'employee'
  }
}
