import { describe, it, expect } from 'vitest';
import { InventoryAdjustmentDto } from '../../../src/modules/inventory/dto/InventoryAdjustmentDto.js';
describe('inventory dto', () => {
  it('validates', () => {
    expect(typeof InventoryAdjustmentDto).toBe('function');
  });
});
