import { describe, it, expect } from "vitest";
import { Logger } from "../../../src/infrastructure/logger/Logger.js";
describe("logger", () => {
  it("exists", () => {
    expect(typeof Logger).toBe("function");
  });
});
