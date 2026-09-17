import { describe, it, expect } from 'vitest';
import { JwtTokenProvider } from '../../../src/infrastructure/security/JwtTokenProvider.js';
describe('JWT provider', () => {
  it('signs and verifies with HS256', () => {
    const provider = new JwtTokenProvider({ jwtSecret: 'testsecret', jwtIssuer: 'test', jwtAudience: 'test', jwtExpiresIn: '1h', databaseUrl: 'postgres://x', redisUrl: 'redis://x' });
    const token = provider.sign({ userId: 1 });
    const payload = provider.verify(token);
    expect(payload.userId).toBe(1);
  });
  it('rejects invalid signature', () => {
    const provider = new JwtTokenProvider({ jwtSecret: 'testsecret', jwtIssuer: 'test', jwtAudience: 'test', jwtExpiresIn: '1h', databaseUrl: 'postgres://x', redisUrl: 'redis://x' });
    expect(() => provider.verify('invalid.token.here')).toThrow();
  });
});
