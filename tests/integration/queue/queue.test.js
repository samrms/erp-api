import { describe, it, expect } from "vitest";
describe("queue infrastructure", () => {
  it("BullMQJobQueue extends BaseJobQueue", () => {
    expect(
      typeof require("../../../src/infrastructure/queue/BullMQJobQueue.js")
        .BullMQJobQueue,
    ).toBe("function");
  });
});
