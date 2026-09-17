import { describe, it, expect } from 'vitest';
import { ProductService } from '../../../src/modules/products/services/ProductService.js';
describe('product service', () => {
  it('findAll and findById delegate', async () => {
    const repo = { findAll: async () => [{ id: 1, name: 'W' }], findById: async (i) => ({ id: i, name: 'W' }), create: async () => ({}), update: async () => ({}), delete: async () => {} };
    const s = new ProductService(repo);
    expect(await s.findAll({})).toHaveLength(1);
    expect(await s.findById('2')).toMatchObject({ id: '2' });
  });
});
