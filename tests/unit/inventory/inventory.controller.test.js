import { describe, it, expect } from 'vitest';
describe('inventory controller', () => {
  it('controller exists', async () => {
    const { InventoryController } = await import('../../../src/modules/inventory/controllers/InventoryController.js');
    expect(typeof InventoryController).toBe('function');
  });
});
