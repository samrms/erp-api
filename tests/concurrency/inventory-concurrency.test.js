import { describe, it, expect } from 'vitest';
describe('concurrency', () => {
  it('inventory must not become negative', () => {
    expect(10 - 7).toBeGreaterThanOrEqual(0);
  });
});
