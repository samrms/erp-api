import { describe, it, expect } from 'vitest';
import { BullMQWorker } from '../../../src/infrastructure/queue/BullMQWorker.js';
describe('worker', () => {
  it('exists', () => { expect(typeof BullMQWorker).toBe('function'); });
});
