export class Supplier {
  constructor({ id, name, email, phone, active }) {
    this.id = id
    this.name = name
    this.email = email || null
    this.phone = phone || null
    this.active = active !== false
  }
  isActive() {
    return this.active
  }
}
