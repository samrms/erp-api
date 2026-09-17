import { describe, it, expect } from 'vitest';
import { ApplicationContainer } from '../../../src/app/ApplicationContainer.js';
describe('application container', () => {
  it('constructs full dependency graph', () => {
    process.env.JWT_SECRET = 'test';
    const c = new ApplicationContainer();
    expect(c.authService).toBeDefined();
    expect(c.productService).toBeDefined();
    expect(c.saleService).toBeDefined();
    expect(c.queue).toBeDefined();
    delete process.env.JWT_SECRET;
  });
});
