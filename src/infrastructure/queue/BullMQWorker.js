import { Worker } from "bullmq";
import { BaseWorker } from "./BaseWorker.js";
export class BullMQWorker extends BaseWorker {
  constructor(config, jobProcessor) {
    super();
    this.worker = new Worker(
      "erp-queue",
      async (job) => {
        return jobProcessor.process(job);
      },
      { connection: { url: config.redisUrl }, concurrency: 2 },
    );
    this.worker.on("completed", (job) => console.log("Job completed", job.id));
    this.worker.on("failed", (job, err) =>
      console.error("Job failed", job?.id, err.message),
    );
  }
  async start() {}
  async stop() {
    await this.worker.close();
  }
}
