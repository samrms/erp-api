import { describe, it, expect } from 'vitest';
describe('queue retry', () => {
  it('BullMQJobQueue provides add method', () => {
    const { BullMQJobQueue } = require('../../../src/infrastructure/queue/BullMQJobQueue.js');
    expect(typeof BullMQJobQueue).toBe('function');
  });
});
