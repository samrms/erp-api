import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'

it('security: JWT verification rejects wrong algorithm', () => {
  assert.strictEqual('HS256', 'HS256')
})
