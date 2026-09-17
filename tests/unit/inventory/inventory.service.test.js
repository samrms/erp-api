import { describe, it, expect } from 'vitest'
import { InventoryService } from '../../../src/modules/inventory/services/InventoryService.js'
describe('unit: inventory', () => {
  it('getStock delegates', async () => {
    const repo = { getStock: async () => 42 }
    const svc = new InventoryService(repo)
    expect(await svc.getStock(1)).toBe(42)
  })
})
