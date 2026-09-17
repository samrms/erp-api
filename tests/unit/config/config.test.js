import { describe, it, expect } from "vitest";
import { Config } from "../../../src/config/Config.js";
describe("config", () => {
  it("reads env", () => {
    process.env.JWT_SECRET = "t";
    const c = new Config();
    expect(typeof c.port).toBe("number");
  });
});
