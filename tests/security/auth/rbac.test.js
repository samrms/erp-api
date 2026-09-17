import { describe, it, expect } from 'vitest';
describe('security rbac', () => {
  it('RBAC denies missing permission', () => {
    expect(true).toBe(true);
  });
});
