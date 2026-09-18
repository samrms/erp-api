import { Config } from "./config/Config.js";
import { ApplicationContainer } from "./app/ApplicationContainer.js";
import { BullMQWorker } from "./infrastructure/queue/BullMQWorker.js";
import { Logger } from "./infrastructure/logger/Logger.js";

class JobProcessor {
  constructor(container, logger) {
    this.container = container;
    this.logger = logger;
  }

  async process(job) {
    this.logger.info({
      event: "job.processing",
      jobId: job.id,
      name: job.name,
    });
    await this.container.jobRepo.updateStatus(job.data.jobId, "completed");
    this.logger.info({ event: "job.completed", jobId: job.id, name: job.name });
  }
}

const config = new Config();
const container = new ApplicationContainer();
const logger = new Logger();
const processor = new JobProcessor(container, logger);
const worker = new BullMQWorker(config, processor);

const graceful = async (_signal) => {
  logger.info({ event: "worker.shutdown" });
  await worker.stop();
  await container.database.close();
  process.exit(0);
};
process.on("SIGTERM", () => graceful("SIGTERM"));
process.on("SIGINT", () => graceful("SIGINT"));
