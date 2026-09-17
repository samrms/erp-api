import { describe, it, expect } from 'vitest';
import { InventoryService } from '../../../src/modules/inventory/services/InventoryService.js';
describe('inventory service', () => {
  it('getStock delegates', async () => {
    expect(await new InventoryService({ getStock: async () => 42 }).getStock(1)).toBe(42);
  });
});
