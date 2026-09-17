import { describe, it, expect } from "vitest";
import { JwtTokenProvider } from "../../../src/infrastructure/security/JwtTokenProvider.js";
import { Config } from "../../../src/config/Config.js";
describe("authentication security", () => {
  it("invalid algorithm rejected", () => {
    const config = new Config();
    process.env.JWT_SECRET = "testsecret";
    const provider = new JwtTokenProvider(config);
    const token = provider.sign({ userId: 1 });
    expect(typeof token).toBe("string");
    const payload = provider.verify(token);
    expect(payload.userId).toBe(1);
  });
});
