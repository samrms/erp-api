import { describe, it, expect } from 'vitest';
import { CustomerDto } from '../../../src/modules/customers/dto/CustomerDto.js';
describe('customer dto', () => {
  it('validates required fields', () => {
    const d = new CustomerDto({ name: 'X', email: 'x@y' });
    expect(d.name).toBe('X');
  });
});
