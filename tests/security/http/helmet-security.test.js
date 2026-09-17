import { describe, it, expect } from 'vitest';
describe('helmet', () => {
  it('helmet module available', () => {
    expect(typeof require('helmet')).toBe('function');
  });
});
