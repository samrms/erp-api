import { describe, it, expect } from 'vitest';
import { BullMQJobQueue } from '../../../src/infrastructure/queue/BullMQJobQueue.js';
describe('job queue', () => {
  it('adds job', async () => {
    const q = new BullMQJobQueue({ redisUrl: 'redis://localhost' });
    expect(typeof q.add).toBe('function');
  });
});
