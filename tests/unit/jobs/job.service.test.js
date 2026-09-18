import { describe, it, expect, vi } from "vitest";
import { JobService } from "../../../src/modules/jobs/services/JobService.js";

function makeService(overrides = {}) {
  const repo = {
    create: vi.fn(async ({ jobType, payload }) => ({
      id: 99,
      job_type: jobType,
      payload,
      status: "pending",
    })),
    findById: vi.fn(async () => null),
    ...overrides.repo,
  };
  const queue = { add: vi.fn(async () => ({ id: "q1" })) };
  if (overrides.queue) {
    for (const [key, fn] of Object.entries(overrides.queue)) {
      queue[key] = vi.fn(fn);
    }
  }
  return { svc: new JobService(repo, queue), repo, queue };
}

describe("JobService.submit", () => {
  it("persists the record first, then enqueues with the database id merged into the payload", async () => {
    const { svc, repo, queue } = makeService();
    const order = [];
    repo.create.mockImplementation(async (data) => {
      order.push("persist");
      return { id: 99, ...data };
    });
    queue.add.mockImplementation(async () => {
      order.push("enqueue");
      return { id: "q1" };
    });

    const result = await svc.submit({
      jobType: "report",
      payload: { format: "pdf" },
    });

    expect(order).toEqual(["persist", "enqueue"]);
    expect(repo.create).toHaveBeenCalledWith({
      jobType: "report",
      payload: { format: "pdf" },
    });
    expect(queue.add).toHaveBeenCalledWith("report", {
      jobId: 99,
      format: "pdf",
    });
    expect(result.id).toBe(99);
  });

  it("propagates queue failures (the persisted record is intentionally left behind)", async () => {
    const { svc, queue } = makeService({
      queue: {
        add: async () => {
          throw new Error("redis down");
        },
      },
    });
    await expect(
      svc.submit({ jobType: "report", payload: {} }),
    ).rejects.toThrow("redis down");
    expect(queue.add).toHaveBeenCalledOnce();
  });
});

describe("JobService.findById", () => {
  it("delegates to the repository", async () => {
    const { svc, repo } = makeService();
    repo.findById.mockResolvedValue({ id: 7, status: "completed" });
    await expect(svc.findById(7)).resolves.toEqual({
      id: 7,
      status: "completed",
    });
  });
});
