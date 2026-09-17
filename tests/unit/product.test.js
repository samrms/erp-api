import assert from 'assert'
import { Product } from '../../src/modules/products/models/Product.js'

const p = new Product({ id: 'x', sku: 'S1', name: 'Test', price: 10, cost: 5 })
assert.strictEqual(p.getPrice(), 10)
assert.strictEqual(p.isActive(), true)
console.log('Unit: Product OK')
