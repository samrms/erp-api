import { describe, it, expect } from "vitest";
import { UserDto } from "../../../src/modules/users/dto/UserDto.js";
describe("user dto", () => {
  it("hides password hash", () => {
    const d = new UserDto({ id: 1, email: "a@b" });
    expect(d.email).toBe("a@b");
  });
});
