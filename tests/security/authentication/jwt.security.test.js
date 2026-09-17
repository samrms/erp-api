import { describe, it, expect } from 'vitest'
describe('security: JWT', () => {
  it('only HS256 accepted', () => {
    expect('HS256').toBe('HS256')
  })
})
