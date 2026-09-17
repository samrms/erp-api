import { BaseService } from '../../../shared/http/BaseService.js'
export class SupplierService extends BaseService {
  constructor(repo) {
    super()
    this.repo = repo
  }
  async findAll(q) {
    return this.repo.findAll(q)
  }
  async findById(id) {
    return this.repo.findById(id)
  }
  async create(d) {
    return this.repo.create(d)
  }
  async update(id, d) {
    return this.repo.update(id, d)
  }
  async delete(id) {
    return this.repo.delete(id)
  }
}
