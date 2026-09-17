import { describe, it, expect } from 'vitest';
import { SaleService } from '../../../src/modules/sales/services/SaleService.js';
describe('sale service', () => {
  it('create uses transaction manager', async () => {
    const repo = { create: async () => ({ id: 10 }), createItem: async () => {} };
    const inv = { getStock: async () => 10, deductStock: async () => ({}), createMovement: async () => {} };
    const tx = { run: async (cb) => cb({ query: async () => ({ rows: [{ id: 1, price: '10.00' }] }) }) };
    const prod = { findById: async () => ({ id: 1, price: '10.00' }) };
    const s = new SaleService(repo, inv, tx, prod);
    expect(await s.create({ customerId: 1, items: [{ productId: 1, quantity: 1 }] })).toMatchObject({ id: 10 });
  });
});
