import { Queue } from 'bullmq'
import { BaseJobQueue } from './BaseJobQueue.js'
export class BullMQJobQueue extends BaseJobQueue {
  constructor(config) {
    super(config)
    this.queue = new Queue('erp-queue', {
      connection: { url: config.redisUrl },
    })
  }
  async add(jobType, payload) {
    return await this.queue.add(jobType, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    })
  }
  async close() {
    await this.queue.close()
  }
}
