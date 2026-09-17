import { describe, it, expect } from 'vitest'
import { JobService } from '../../../src/modules/jobs/services/JobService.js'
describe('unit: jobs', () => {
  it('submit creates and enqueues', async () => {
    const repo = { create: async () => ({ id: 99 }) }
    const queue = { add: async () => ({ id: 'q1' }) }
    const svc = new JobService(repo, queue)
    const j = await svc.submit({ jobType: 'report', payload: { reportId: 1 } })
    expect(j.id).toBe(99)
  })
})
