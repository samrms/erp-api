import assert from 'assert'
import { ProductService } from '../../src/modules/products/services/ProductService.js'
import { Product } from '../../src/modules/products/models/Product.js'

class FakeRepo {
  constructor() {
    this.items = []
  }
  async findById(id) {
    return this.items.find((i) => i.id === id) || null
  }
  async findBySku(sku) {
    return this.items.find((i) => i.sku === sku) || null
  }
  async findMany() {
    return {
      data: this.items,
      pagination: {
        page: 1,
        limit: 20,
        total: this.items.length,
        totalPages: 1,
      },
    }
  }
  async create(data) {
    const row = {
      id: 'p-' + this.items.length,
      ...data,
      created_at: new Date(),
    }
    this.items.push(row)
    return row
  }
  async update(id, updates) {
    const idx = this.items.findIndex((i) => i.id === id)
    if (idx < 0) return null
    this.items[idx] = { ...this.items[idx], ...updates, updated_at: new Date() }
    return this.items[idx]
  }
  async deactivate(id) {
    const row = await this.findById(id)
    if (row) row.active = false
    return row
  }
}

const repo = new FakeRepo()
const service = new ProductService(repo)

const p = await service.create({ sku: 'SKU1', name: 'P', price: 10, cost: 2 })
assert.strictEqual(p.sku, 'SKU1')
assert.strictEqual(p.getPrice(), 10)

await service.update(p.id, { price: 15 })
const updated = await service.findById(p.id)
assert.strictEqual(updated.getPrice(), 15)

console.log('Unit: ProductService OK')
