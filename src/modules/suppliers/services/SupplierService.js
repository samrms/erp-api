import { Supplier } from '../models/Supplier.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
export class SupplierService {
  constructor(repo) {
    this.repo = repo
  }
  async create(data) {
    const r = await this.repo.create(data)
    return new Supplier(r)
  }
  async findById(id) {
    const r = await this.repo.findById(id)
    if (!r) throw new NotFoundError()
    return new Supplier(r)
  }
  async findMany(q) {
    return (await this.repo.findMany(q)).map((r) => new Supplier(r))
  }
}
