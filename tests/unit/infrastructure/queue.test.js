import { describe, it, expect } from "vitest";
import { BullMQJobQueue } from "../../../src/infrastructure/queue/BullMQJobQueue.js";
describe("queue", () => {
  it("exists", () => {
    expect(typeof BullMQJobQueue).toBe("function");
  });
});
