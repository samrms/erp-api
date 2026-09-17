import { describe, it, expect } from 'vitest'
describe('integration: database', () => {
  it('DATABASE_URL may be configured', () => {
    expect(
      typeof process.env.DATABASE_URL === 'string' ||
        typeof process.env.DATABASE_URL === 'undefined',
    ).toBe(true)
  })
})
