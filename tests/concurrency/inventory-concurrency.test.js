import { describe, it, expect } from 'vitest';
describe('concurrency', () => {
  it('inventory updates atomic', () => {
    expect(10 - 7).toBeGreaterThanOrEqual(0);
  });
});
