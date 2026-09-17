export class User {
  #passwordHash

  constructor({ id, email, role, active, passwordHash }) {
    this.id = id
    this.email = email
    this.role = role || 'employee'
    this.active = active !== false
    this.#passwordHash = passwordHash
  }

  getPasswordHash() {
    return this.#passwordHash
  }

  setPasswordHash(hash) {
    this.#passwordHash = hash
  }

  isActive() {
    return this.active
  }
}
