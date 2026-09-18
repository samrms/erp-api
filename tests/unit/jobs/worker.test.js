import { describe, it, expect, vi, beforeEach } from "vitest";

const { WorkerMock } = vi.hoisted(() => ({ WorkerMock: vi.fn() }));

vi.mock("bullmq", () => ({ Worker: WorkerMock }));

import { BullMQWorker } from "../../../src/infrastructure/queue/BullMQWorker.js";

const config = { redisUrl: "redis://localhost:6379" };

function mockWorkerInstance() {
  return {
    processor: null,
    handlers: {},
    on(event, handler) {
      this.handlers[event] = handler;
    },
    close: vi.fn(async () => "stopped"),
  };
}

describe("BullMQWorker", () => {
  beforeEach(() => {
    WorkerMock.mockClear();
    WorkerMock.mockImplementation(function (_name, processor, _opts) {
      const instance = mockWorkerInstance();
      instance.processor = processor;
      return instance;
    });
  });

  it("consumes the shared queue with concurrency 2", () => {
    new BullMQWorker(config, { process: async () => {} });
    expect(WorkerMock).toHaveBeenCalledWith("erp-queue", expect.any(Function), {
      connection: { url: "redis://localhost:6379" },
      concurrency: 2,
    });
  });

  it("delegates each job to the processor and returns its result", async () => {
    const processor = { process: vi.fn(async (job) => `done-${job.id}`) };
    new BullMQWorker(config, processor);
    const instance = WorkerMock.mock.results[0].value;
    await expect(instance.processor({ id: "1", data: {} })).resolves.toBe(
      "done-1",
    );
    expect(processor.process).toHaveBeenCalledWith({ id: "1", data: {} });
  });

  it("propagates processor failures (so BullMQ can retry)", async () => {
    const processor = {
      process: vi.fn(async () => {
        throw new Error("handler exploded");
      }),
    };
    new BullMQWorker(config, processor);
    const instance = WorkerMock.mock.results[0].value;
    await expect(instance.processor({ id: "9" })).rejects.toThrow(
      "handler exploded",
    );
  });

  it("stops by closing the underlying worker", async () => {
    const worker = new BullMQWorker(config, { process: async () => {} });
    await worker.stop();
    expect(WorkerMock.mock.results[0].value.close).toHaveBeenCalledOnce();
  });
});
