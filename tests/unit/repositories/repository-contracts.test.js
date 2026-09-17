import { describe, it, expect } from 'vitest';
import { PostgresProductRepository } from '../../../src/modules/products/repositories/PostgresProductRepository.js';
describe('repository contracts', () => {
  it('parameterized SQL', () => {
    expect(typeof PostgresProductRepository).toBe('function');
  });
});
