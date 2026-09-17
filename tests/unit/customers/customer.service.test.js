import { describe, it, expect } from 'vitest';
import { CustomerService } from '../../../src/modules/customers/services/CustomerService.js';
describe('customer service', () => {
  it('create delegates', async () => {
    const repo = { create: async (d) => ({ id: 1, ...d }) };
    expect(await new CustomerService(repo).create({ name: 'N' })).toMatchObject({ name: 'N' });
  });
});
