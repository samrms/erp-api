import { test } from 'node:test'
import assert from 'node:assert'
import { BaseError } from '../../src/shared/errors/BaseError.js'

test('unit: BaseError carries status and code', () => {
  const e = new BaseError('msg', 404, 'NOT_FOUND')
  assert.strictEqual(e.message, 'msg')
  assert.strictEqual(e.statusCode, 404)
  assert.strictEqual(e.code, 'NOT_FOUND')
})
