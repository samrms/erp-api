import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../setup/api.js";
import { grantPermissions } from "../setup/factories.js";

let api;
let counter = 0;

beforeAll(async () => {
  api = await startTestApi("e2e-credential-rotation");
});

afterAll(async () => {
  await api.close();
});

describe("credential rotation", () => {
  it("rotates the password while existing sessions keep working", async () => {
    const email = `rotate-${++counter}@example.com`;
    const registered = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/register",
      {
        body: { email, password: "first-secret", firstName: "Rot" },
      },
    );
    await grantPermissions(api.db, registered.body.id, ["product:read"]);
    const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
      body: { email, password: "first-secret" },
    });
    const oldToken = login.body.token;

    const rotated = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/change-password",
      {
        token: oldToken,
        body: { currentPassword: "first-secret", newPassword: "second-secret" },
      },
    );
    expect(rotated.status).toBe(200);

    const staleLogin = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/login",
      {
        body: { email, password: "first-secret" },
      },
    );
    expect(staleLogin.status).toBe(401);

    const freshLogin = await apiFetch(
      api.baseUrl,
      "POST",
      "/api/v1/auth/login",
      {
        body: { email, password: "second-secret" },
      },
    );
    expect(freshLogin.status).toBe(200);

    const withOldToken = await apiFetch(
      api.baseUrl,
      "GET",
      "/api/v1/products",
      {
        token: oldToken,
      },
    );
    expect(withOldToken.status).toBe(200);
  });
});
