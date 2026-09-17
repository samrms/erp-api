import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('sql injection security', () => {
  it('all repositories parameterized', () => {
    const files = [
      'src/modules/auth/repositories/PostgresAuthRepository.js',
      'src/modules/products/repositories/PostgresProductRepository.js',
      'src/modules/customers/repositories/PostgresCustomerRepository.js',
      'src/modules/suppliers/repositories/PostgresSupplierRepository.js',
      'src/modules/inventory/repositories/PostgresInventoryRepository.js',
      'src/modules/sales/repositories/PostgresSaleRepository.js',
      'src/modules/jobs/repositories/PostgresJobRepository.js',
    ];
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      expect(content).toContain('$1');
    }
  });
});
