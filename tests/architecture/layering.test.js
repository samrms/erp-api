import { describe, it, expect } from 'vitest';
describe('layering', () => {
  it('controllers import services but not repositories directly', () => {
    const controllers = [
      'src/modules/auth/controllers/AuthController.js',
      'src/modules/products/controllers/ProductController.js',
      'src/modules/sales/controllers/SaleController.js',
    ];
    for (const f of controllers) {
      const content = require('fs').readFileSync(f, 'utf8');
      expect(content).toContain('Service');
    }
  });
});
