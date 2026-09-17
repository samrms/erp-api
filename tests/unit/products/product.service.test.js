import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { ProductService } from '../../../src/modules/products/services/ProductService.js'

it('product service: findAll and findById delegate to repo', async () => {
  const repo = {
    findAll: async (q) => [{ id: 1, name: 'Widget' }],
    findById: async (id) => ({ id: parseInt(id), name: 'Widget' }),
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => {},
  }
  const svc = new ProductService(repo)
  const list = await svc.findAll({})
  assert.strictEqual(list.length, 1)
  const item = await svc.findById('1')
  assert.strictEqual(item.name, 'Widget')
})
