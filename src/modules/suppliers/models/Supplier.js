import { BaseDomainModel } from '../../../shared/domain/BaseDomainModel.js'
export class Supplier extends BaseDomainModel {
  constructor({ id, name, email, phone }) {
    super()
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
  }
}
