import { Customer } from '../models/Customer.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
export class CustomerService {
  constructor(repo) {
    this.repo = repo
  }
  async create(data) {
    const row = await this.repo.create(data)
    return new Customer(row)
  }
  async findById(id) {
    const row = await this.repo.findById(id)
    if (!row) throw new NotFoundError()
    return new Customer(row)
  }
  async findMany(query) {
    return await this.repo.findMany(query)
  }
  async update(id, data) {
    const row = (await this.repo.update)
      ? await this.repo.update(id, data)
      : await this.repo.findById(id)
    return new Customer(row)
  }
}
