import { Worker } from "bullmq";
import { Logger } from "../logger/Logger.js";

import { BaseWorker } from "./BaseWorker.js";

export class BullMQWorker extends BaseWorker {
  constructor(config, jobProcessor) {
    super();
    this.logger = new Logger();
    this.worker = new Worker(
      "erp-queue",
      async (job) => {
        return jobProcessor.process(job);
      },
      { connection: { url: config.redisUrl }, concurrency: 2 },
    );
    this.worker.on("completed", (job) =>
      this.logger.info({ event: "queue.job.completed", jobId: job.id }),
    );
    this.worker.on("failed", (job, err) =>
      this.logger.error({
        event: "queue.job.failed",
        jobId: job?.id,
        error: err.message,
      }),
    );
  }

  async start() {}

  async stop() {
    await this.worker.close();
  }
}
