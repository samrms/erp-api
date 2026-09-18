import { describe, it, expect, vi, beforeEach } from "vitest";

const { QueueMock } = vi.hoisted(() => ({ QueueMock: vi.fn() }));

vi.mock("bullmq", () => ({ Queue: QueueMock }));

import { BullMQJobQueue } from "../../../src/infrastructure/queue/BullMQJobQueue.js";

const config = { redisUrl: "redis://localhost:6379" };

describe("BullMQJobQueue", () => {
  beforeEach(() => {
    QueueMock.mockClear();
    QueueMock.mockImplementation(function () {
      return {
        add: vi.fn(async (...args) => ({ queued: args })),
        close: vi.fn(async () => "closed"),
      };
    });
  });

  it("opens the shared erp-queue against the configured Redis", () => {
    new BullMQJobQueue(config);
    expect(QueueMock).toHaveBeenCalledWith("erp-queue", {
      connection: { url: "redis://localhost:6379" },
    });
  });

  it("enqueues with 3 attempts and exponential backoff", async () => {
    const queue = new BullMQJobQueue(config);
    await queue.add("report", { jobId: 5 });
    const inner = QueueMock.mock.results[0].value;
    expect(inner.add).toHaveBeenCalledWith(
      "report",
      { jobId: 5 },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
      },
    );
  });

  it("delegates close to the underlying queue", async () => {
    const queue = new BullMQJobQueue(config);
    await queue.close();
    const inner = QueueMock.mock.results[0].value;
    expect(inner.close).toHaveBeenCalledOnce();
  });
});
