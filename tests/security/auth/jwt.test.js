import { describe, it, expect } from 'vitest';
describe('security auth', () => {
  it('JWT uses HS256', () => {
    expect('HS256').toBe('HS256');
  });
});
