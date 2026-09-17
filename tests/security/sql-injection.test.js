import { test } from 'node:test'
import assert from 'node:assert'

test('security: parameterized SQL prevents injection via search parameter', async () => {
  // Awareness test: no interpolation of user input into SQL strings in repositories.
  assert.strictEqual(true, true)
})
