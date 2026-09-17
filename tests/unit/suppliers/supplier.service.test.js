import { describe, it, expect } from 'vitest'
import { SupplierService } from '../../../src/modules/suppliers/services/SupplierService.js'
describe('unit: supplier', () => {
  it('findAll delegates', async () => {
    const repo = { findAll: async () => [{ id: 1, name: 'S1' }] }
    const svc = new SupplierService(repo)
    expect((await svc.findAll({})).length).toBe(1)
  })
})
