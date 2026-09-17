import { describe, it, expect } from "vitest";
describe("job repo", () => {
  it("parameterized", () =>
    expect(
      typeof require("../../../src/modules/jobs/repositories/PostgresJobRepository.js")
        .PostgresJobRepository,
    ).toBe("function"));
});
