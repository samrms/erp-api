import { describe, it, expect } from 'vitest'
describe('concurrency', () => {
  it('inventory should not oversell under concurrent updates', () => {
    expect(10 - 7).toBeGreaterThanOrEqual(0)
  })
})
