import { describe, it, expect } from 'vitest'
import { SaleService } from '../../../src/modules/sales/services/SaleService.js'

describe('sale service', () => {
  it('create commits transaction and returns sale', async () => {
    const repo = {
      create: async () => ({ id: 10 }),
      createItem: async () => {},
    }
    const invRepo = {
      getStock: async () => 10,
      deductStock: async () => ({ quantity: 9 }),
      createMovement: async () => {},
    }
    const tx = {
      run: async (cb) =>
        cb({ query: async () => ({ rows: [{ id: 1, price: '10.00' }] }) }),
    }
    const productRepo = { findById: async () => ({ id: 1, price: '10.00' }) }
    const svc = new SaleService(repo, invRepo, tx, productRepo)
    const sale = await svc.create({
      customerId: 1,
      items: [{ productId: 1, quantity: 1 }],
    })
    expect(sale.id).toBe(10)
  })
})
