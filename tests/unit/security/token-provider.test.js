import { describe, it, expect } from "vitest";
import { JwtTokenProvider } from "../../../src/infrastructure/security/JwtTokenProvider.js";
describe("token provider", () => {
  it("signs and verifies", () => {
    const p = new JwtTokenProvider({
      jwtSecret: "s",
      jwtIssuer: "t",
      jwtAudience: "t",
      jwtExpiresIn: "1h",
      databaseUrl: "x",
      redisUrl: "x",
    });
    const token = p.sign({ userId: 1 });
    expect(p.verify(token).userId).toBe(1);
  });
});
