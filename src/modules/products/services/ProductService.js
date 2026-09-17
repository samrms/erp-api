import { Product } from '../models/Product.js'
import { BusinessRuleError } from '../../../shared/errors/BusinessRuleError.js'
import { ConflictError } from '../../../shared/errors/ConflictError.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  async create(dto) {
    const existing = await this.productRepository.findBySku(dto.sku)
    if (existing) throw new ConflictError('SKU already exists')
    const row = await this.productRepository.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      cost: dto.cost || 0,
    })
    return new Product(row)
  }

  async findById(id) {
    const row = await this.productRepository.findById(id)
    if (!row) throw new NotFoundError('Product not found')
    return new Product(row)
  }

  async findMany(query) {
    return await this.productRepository.findMany(query)
  }

  async update(id, dto) {
    const product = await this.findById(id)
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productRepository.findBySku(dto.sku)
      if (existing && existing.id !== id)
        throw new ConflictError('SKU already exists')
    }
    const updates = {}
    if (dto.name !== undefined) updates.name = dto.name
    if (dto.description !== undefined) updates.description = dto.description
    if (dto.price !== undefined) updates.price = dto.price
    if (dto.cost !== undefined) updates.cost = dto.cost
    if (dto.active !== undefined) updates.active = dto.active
    const row = await this.productRepository.update(id, updates)
    return new Product(row)
  }

  async deactivate(id) {
    const row = await this.productRepository.deactivate(id)
    return new Product(row)
  }
}
