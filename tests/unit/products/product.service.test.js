import { describe, it, expect } from 'vitest'
import { ProductService } from '../../../src/modules/products/services/ProductService.js'

describe('product service', () => {
  it('findAll returns array', async () => {
    const repo = {
      findAll: async () => [{ id: 1, name: 'Widget' }],
    }
    const svc = new ProductService(repo)
    const list = await svc.findAll({})
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('Widget')
  })

  it('findById returns item', async () => {
    const repo = { findById: async () => ({ id: 1, name: 'X' }) }
    const svc = new ProductService(repo)
    expect((await svc.findById('1')).name).toBe('X')
  })
})
