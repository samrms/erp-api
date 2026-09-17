import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { InventoryService } from '../../../src/modules/inventory/services/InventoryService.js'

it('inventory service: getStock delegates', async () => {
  const repo = { getStock: async () => 42 }
  const svc = new InventoryService(repo)
  assert.strictEqual(await svc.getStock(1), 42)
})
