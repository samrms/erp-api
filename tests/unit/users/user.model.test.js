import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { User } from '../../../src/modules/users/models/User.js'

it('domain: User protects invariants', () => {
  const u = new User({ id: 1, email: 'a@b.com', passwordHash: 'x' })
  assert.strictEqual(u.email, 'a@b.com')
})
