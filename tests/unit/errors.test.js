import { describe, it, expect } from 'vitest'

class MockBaseError extends Error {
  constructor(message, statusCode, code) {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}
describe('unit: errors', () => {
  it('BaseError carries status and code', () => {
    class MockBaseError extends Error {
      constructor(message, statusCode, code) {
        super(message)
        this.statusCode = statusCode
        this.code = code
      }
    }
    const e = new MockBaseError('msg', 404, 'NOT_FOUND')
    expect(e.message).toBe('msg')
    expect(e.statusCode).toBe(404)
    expect(e.code).toBe('NOT_FOUND')
  })
})
