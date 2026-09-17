import { BaseDomainModel } from '../../../shared/domain/BaseDomainModel.js'
export class Customer extends BaseDomainModel {
  constructor({ id, name, email, phone, address }) {
    super()
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
    this.address = address
  }
}
