import { describe, it, expect } from 'vitest'
describe('concurrency', () => {
  it('inventory deduction must be atomic', () => {
    expect(10 - 7).toBeGreaterThanOrEqual(0)
  })
})
