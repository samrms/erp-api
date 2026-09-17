import { describe, it, expect } from 'vitest';

import { test } from 'node:test'
import assert from 'node:assert'
import { JobService } from '../../../src/modules/jobs/services/JobService.js'

it('job service: submit creates job and enqueues', async () => {
  const repo = {
    create: async () => ({ id: 99, jobType: 'report', status: 'pending' }),
  }
  const queue = { add: async () => ({ id: 'q1' }) }
  const svc = new JobService(repo, queue)
  const j = await svc.submit({ jobType: 'report', payload: { reportId: 1 } })
  assert.strictEqual(j.id, 99)
})
