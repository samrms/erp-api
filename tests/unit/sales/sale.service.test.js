import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { SaleService } from '../../../src/modules/sales/services/SaleService.js'

it('sale service: create uses transaction manager', async () => {
  const repo = { create: async () => ({ id: 1 }), createItem: async () => {} }
  const invRepo = {
    getStock: async () => 10,
    deductStock: async () => ({ quantity: 10 }),
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
  assert.strictEqual(sale.id, 1)
})
