import { describe, it, expect } from 'vitest';
import { JobService } from '../../../src/modules/jobs/services/JobService.js';
describe('job service', () => {
  it('submit creates and enqueues', async () => {
    const repo = { create: async () => ({ id: 99 }) };
    const q = { add: async () => ({ id: 'q1' }) };
    expect(await new JobService(repo, q).submit({ jobType: 'r', payload: {} })).toMatchObject({ id: 99 });
  });
});
