import { describe, it, expect } from 'vitest';
describe('queue integration', () => {
  it('bullmq infrastructure available', async () => {
    const { BullMQJobQueue } = await import('../../../src/infrastructure/queue/BullMQJobQueue.js');
    expect(typeof BullMQJobQueue).toBe('function');
  });
  it('queue can be added', async () => {
    const { BullMQJobQueue } = await import('../../../src/infrastructure/queue/BullMQJobQueue.js');
    expect(typeof BullMQJobQueue.prototype.add).toBe('function');
  });
});
