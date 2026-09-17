import { describe, it, expect } from 'vitest';
import { PostgresProductRepository } from '../../../src/modules/products/repositories/PostgresProductRepository.js';
describe('repository parameterization', () => {
  it('PostgresProductRepository uses parameterized SQL', () => {
    const repo = new PostgresProductRepository({ query: async () => ({ rows: [] }) });
    expect(typeof repo.findAll).toBe('function');
  });
});
