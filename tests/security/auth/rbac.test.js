import { describe, it, expect } from 'vitest';
import { RBACMiddleware } from '../../../src/modules/auth/middleware/RBACMiddleware.js';
describe('RBAC middleware', () => {
  it('denies access without required permission', () => {
    const mw = new RBACMiddleware();
    const handler = mw.handle('product:create');
    const req = { user: { permissions: [] } };
    const res = {};
    let called = false;
    handler(req, res, (err) => { called = true; expect(err).toBeDefined(); });
    expect(called).toBe(true);
  });
});
