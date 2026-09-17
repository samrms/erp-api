import { describe, it, expect } from 'vitest';
describe('auth controller', () => {
  it('register calls service', async () => {
    const svc = { register: async () => ({ id: 1 }) };
    const { AuthController } = await import('../../../src/modules/auth/controllers/AuthController.js');
    const ctrl = new AuthController(svc);
    const res = await ctrl.register({ body: { email: 't@t.com', password: 'x' } }, { status: () => ({ json: (r) => r }) });
    expect(res.id).toBe(1);
  });
});
