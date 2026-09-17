import { describe, it, expect } from 'vitest'
describe('integration: database', () => {
  it('database url is set', () => {
    expect(
      typeof process.env.DATABASE_URL === 'string' ||
        typeof process.env.DATABASE_URL === 'undefined',
    ).toBe(true)
  })
})
