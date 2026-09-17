import { describe, it, expect } from 'vitest'
describe('integration', () => {
  it('product repository class is exported', async () => {
    const mod =
      await import('../../../src/modules/products/repositories/PostgresProductRepository.js')
    expect(typeof mod.PostgresProductRepository).toBe('function')
  })
})
