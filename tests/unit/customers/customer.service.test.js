import { describe, it, expect } from 'vitest'
import { CustomerService } from '../../../src/modules/customers/services/CustomerService.js'
describe('unit: customer', () => {
  it('create delegates', async () => {
    const repo = { create: async (d) => ({ id: 1, ...d }) }
    const svc = new CustomerService(repo)
    const c = await svc.create({ name: 'Acme' })
    expect(c.name).toBe('Acme')
  })
})
