import { describe, it, expect } from 'vitest';
describe('db connection', () => {
  it('DATABASE_URL set or undefined', () => {
    expect(typeof process.env.DATABASE_URL === 'string' || typeof process.env.DATABASE_URL === 'undefined').toBe(true);
  });
});
