import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { CustomerService } from '../../../src/modules/customers/services/CustomerService.js'

it('customer service: create delegates', async () => {
  const repo = { create: async (d) => ({ id: 1, ...d }) }
  const svc = new CustomerService(repo)
  const c = await svc.create({ name: 'Acme' })
  assert.strictEqual(c.name, 'Acme')
})
