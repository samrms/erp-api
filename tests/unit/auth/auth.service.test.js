import { describe, it, expect } from 'vitest'
import { AuthService } from '../../../src/modules/auth/services/AuthService.js'

describe('auth service', () => {
  it('register creates user when email is new', async () => {
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
    expect(result.email).toBe('test@erp.com')
    expect(result.id).toBe(1)
  })

  it('login returns token for valid credentials', async () => {
    const repo = {
      findByEmail: async () => ({
        id: 2,
        email: 'a@b.com',
        password_hash: 'hash_secret',
      }),
    }
    const hasher = { verify: async (hash, pw) => pw === 'secret' }
    const tokenProvider = { sign: () => 'jwt_token' }
    const service = new AuthService(repo, hasher, tokenProvider)
    const result = await service.login({ email: 'a@b.com', password: 'secret' })
    expect(result.token).toBe('jwt_token')
    expect(result.user.id).toBe(2)
  })
})
