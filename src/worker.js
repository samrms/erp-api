import { Config } from './config/Config.js'
import { ApplicationContainer } from './app/ApplicationContainer.js'
import { BullMQWorker } from './infrastructure/queue/BullMQWorker.js'

class JobProcessor {
  constructor(container) {
    this.container = container
  }
  async process(job) {
    console.log('Processing job', job.name, job.id)
    await this.container.jobRepo.updateStatus(job.data.jobId, 'completed')
  }
}

const config = new Config()
const container = new ApplicationContainer()
const processor = new JobProcessor(container)
const worker = new BullMQWorker(config, processor)

const graceful = async (signal) => {
  console.log('Worker shutting down...')
  await worker.stop()
  await container.database.close()
  process.exit(0)
}
process.on('SIGTERM', () => graceful('SIGTERM'))
process.on('SIGINT', () => graceful('SIGINT'))
