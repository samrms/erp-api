import { describe, it, expect } from 'vitest';
import { RBACMiddleware } from '../../../src/modules/auth/middleware/RBACMiddleware.js';
describe('rbac middleware', () => {
  it('denied without role', () => {
    const mw = new RBACMiddleware();
    const handler = mw.handle('product:create');
    let denied = false;
    handler({ user: { permissions: [] } }, {}, (e) => { if (e) denied = true; });
    expect(denied).toBe(true);
  });
});
