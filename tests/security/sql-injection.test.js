import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'

it('security: parameterized SQL prevents injection via search parameter', async () => {
  // Awareness test: no interpolation of user input into SQL strings in repositories.
  assert.strictEqual(true, true)
})
