import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { JwtTokenProvider } from "../../../src/infrastructure/security/JwtTokenProvider.js";

function makeProvider(overrides = {}) {
  return new JwtTokenProvider({
    jwtSecret: "test-secret",
    jwtIssuer: "erp-api-test",
    jwtAudience: "erp-api-test",
    jwtExpiresIn: "1h",
    ...overrides,
  });
}

describe("JwtTokenProvider", () => {
  it("round-trips a payload with issuer, audience, and HS256", () => {
    const provider = makeProvider();
    const token = provider.sign({ userId: 1, permissions: ["product:read"] });
    const payload = provider.verify(token);
    expect(payload.userId).toBe(1);
    expect(payload.permissions).toEqual(["product:read"]);
    expect(payload.iss).toBe("erp-api-test");
    expect(payload.aud).toBe("erp-api-test");
    const header = JSON.parse(
      Buffer.from(token.split(".")[0], "base64url").toString(),
    );
    expect(header.alg).toBe("HS256");
  });

  it("rejects tampered tokens", () => {
    const provider = makeProvider();
    const [h, p, s] = provider.sign({ userId: 1 }).split(".");
    expect(() => provider.verify(`${h}.${p}.${s}tampered`)).toThrow();
  });

  it("rejects tokens signed with a different secret", () => {
    const other = makeProvider({ jwtSecret: "different-secret" });
    const token = other.sign({ userId: 1 });
    expect(() => makeProvider().verify(token)).toThrow();
  });

  it("rejects tokens with a wrong issuer or audience", () => {
    const token = makeProvider({ jwtIssuer: "evil" }).sign({ userId: 1 });
    expect(() => makeProvider().verify(token)).toThrow();
    const token2 = makeProvider({ jwtAudience: "evil" }).sign({ userId: 1 });
    expect(() => makeProvider().verify(token2)).toThrow();
  });

  it("rejects expired tokens", () => {
    const expired = jwt.sign(
      { userId: 1, exp: Math.floor(Date.now() / 1000) - 60 },
      "test-secret",
      { issuer: "erp-api-test", audience: "erp-api-test", algorithm: "HS256" },
    );
    expect(() => makeProvider().verify(expired)).toThrow(/expired/i);
  });

  it("rejects non-JWT garbage", () => {
    expect(() => makeProvider().verify("not-a-token")).toThrow();
  });
});
