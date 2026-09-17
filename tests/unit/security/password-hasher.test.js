import { describe, it, expect } from 'vitest';
import { Argon2PasswordHasher } from '../../../src/infrastructure/security/Argon2PasswordHasher.js';
describe('password hasher', () => {
  it('hash verifies', async () => {
    const h = new Argon2PasswordHasher();
    const hash = await h.hash('secret');
    expect(await h.verify(hash, 'secret')).toBe(true);
  });
});
