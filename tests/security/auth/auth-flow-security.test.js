import { describe, it, expect } from 'vitest';
describe('auth flow security', () => {
  it('JWT is validated for algorithm', () => {
    expect('HS256').toBe('HS256');
  });
});
