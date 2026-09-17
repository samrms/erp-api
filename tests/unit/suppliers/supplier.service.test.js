import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { SupplierService } from '../../../src/modules/suppliers/services/SupplierService.js'

it('supplier service: findAll delegates', async () => {
  const repo = { findAll: async () => [{ id: 1, name: 'S1' }] }
  const svc = new SupplierService(repo)
  assert.strictEqual((await svc.findAll({})).length, 1)
})
