import { BaseService } from '../../../shared/http/BaseService.js'
export class ProductService extends BaseService {
  constructor(productRepository) {
    super()
    this.productRepository = productRepository
  }
  async create(data) {
    return this.productRepository.create(data)
  }
  async findAll(query) {
    return this.productRepository.findAll(query)
  }
  async findById(id) {
    return this.productRepository.findById(id)
  }
  async update(id, data) {
    return this.productRepository.update(id, data)
  }
  async delete(id) {
    return this.productRepository.delete(id)
  }
}
