import { describe, it, expect } from 'vitest';
describe('customer controller', () => {
  it('create delegates', async () => {
    const svc = { create: async () => ({ id: 1 }) };
    const { CustomerController } = await import('../../../src/modules/customers/controllers/CustomerController.js');
    const ctrl = new CustomerController(svc);
    const r = await ctrl.create({ body: { name: 'N' } }, { status: () => ({ json: (x) => x }) });
    expect(r.id).toBe(1);
  });
});
