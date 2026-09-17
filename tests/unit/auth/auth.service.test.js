import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { AuthService } from '../../../src/modules/auth/services/AuthService.js'

it('auth: register creates user', async () => {
  const repo = {
    findByEmail: async () => null,
    create: async (email, hash) => ({ id: 1, email, password_hash: hash }),
  }
  const hasher = { hash: async (p) => 'hash_' + p }
  const tokenProvider = { sign: () => 'token' }
  const service = new AuthService(repo, hasher, tokenProvider)
  const result = await service.register({
    email: 'test@erp.com',
    password: 'secret',
  })
  assert.strictEqual(result.email, 'test@erp.com')
})
