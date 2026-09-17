import { describe, it, expect } from "vitest";
describe("SQL injection awareness", () => {
  it("repositories do not interpolate user input", () => {
    const contents = require("fs").readFileSync(
      "src/modules/auth/repositories/PostgresAuthRepository.js",
      "utf8",
    );
    expect(contents).toContain("$1");
    expect(contents).not.toContain("`SELECT");
  });
});
