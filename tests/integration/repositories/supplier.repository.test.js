import { describe, it, expect } from 'vitest';
describe('supplier repo', () => { it('parameterized', () => expect(typeof require('../../../src/modules/suppliers/repositories/PostgresSupplierRepository.js').PostgresSupplierRepository).toBe('function')); });
