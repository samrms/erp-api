import { describe, it, expect } from 'vitest'

describe('integration: repository abstraction', () => {
  it('PostgresProductRepository exists', async () => {
    const mod =
      await import('../../../src/modules/products/repositories/PostgresProductRepository.js')
    expect(typeof mod.PostgresProductRepository).toBe('function')
  })
})
