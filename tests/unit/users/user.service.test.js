import { describe, it, expect, vi } from "vitest";
import { UserService } from "../../../src/modules/users/services/UserService.js";
import { ConflictError } from "../../../src/shared/errors/ConflictError.js";
import { NotFoundError } from "../../../src/shared/errors/NotFoundError.js";

function makeService(overrides = {}) {
  const repo = {
    findAll: vi.fn(async () => []),
    findById: vi.fn(async () => null),
    findRoleByName: vi.fn(async () => null),
    assignRole: vi.fn(async () => true),
    ...overrides,
  };
  return { svc: new UserService(repo), repo };
}

describe("UserService.findAll", () => {
  it("delegates pagination to the repository", async () => {
    const { svc, repo } = makeService();
    repo.findAll.mockResolvedValue([{ id: 1 }]);
    await expect(svc.findAll({ limit: 5 })).resolves.toEqual([{ id: 1 }]);
    expect(repo.findAll).toHaveBeenCalledWith({ limit: 5 });
  });
});

describe("UserService.findById", () => {
  it("returns the user when present", async () => {
    const { svc, repo } = makeService();
    repo.findById.mockResolvedValue({ id: 3, email: "a@b.c" });
    await expect(svc.findById(3)).resolves.toEqual({ id: 3, email: "a@b.c" });
  });

  it("throws NotFoundError for unknown users", async () => {
    const { svc } = makeService();
    await expect(svc.findById(99)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("UserService.promote", () => {
  const user = { id: 5, email: "u@e.com" };
  const role = { id: 2, name: "admin" };

  it("assigns the role and returns the assignment", async () => {
    const { svc, repo } = makeService({
      findById: async () => user,
      findRoleByName: async () => role,
    });
    await expect(svc.promote(5, { role: "admin" })).resolves.toEqual({
      id: 5,
      role: "admin",
    });
    expect(repo.assignRole).toHaveBeenCalledWith(5, 2);
  });

  it("throws NotFoundError for unknown users", async () => {
    const { svc, repo } = makeService();
    await expect(svc.promote(99, { role: "admin" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(repo.assignRole).not.toHaveBeenCalled();
  });

  it("throws NotFoundError for unknown roles", async () => {
    const { svc, repo } = makeService({ findById: async () => user });
    await expect(svc.promote(5, { role: "nope" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(repo.assignRole).not.toHaveBeenCalled();
  });

  it("throws ConflictError when the user already has the role", async () => {
    const { svc } = makeService({
      findById: async () => user,
      findRoleByName: async () => role,
      assignRole: async () => false,
    });
    await expect(svc.promote(5, { role: "admin" })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });
});
