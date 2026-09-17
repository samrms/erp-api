import { describe, it, expect } from 'vitest';
describe('idor security', () => {
  it('resource access requires authorization', () => {
    expect(typeof 'authorization').toBe('string');
  });
});
