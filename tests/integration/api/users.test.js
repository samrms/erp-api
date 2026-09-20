import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";
import { grantPermissions } from "../../setup/factories.js";

let api;
let adminToken;
let userToken;
let plainUserId;
let counter = 0;

const ALL = [
  "product:read",
  "customer:read",
  "supplier:read",
  "sale:read",
  "inventory:read",
  "job:read",
  "user:read",
  "user:write",
];

beforeAll(async () => {
  api = await startTestApi("api-users");
  await api.db.query(
    "INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING",
  );

  const adminEmail = `admin-${++counter}@example.com`;
  const registered = await apiFetch(
    api.baseUrl,
    "POST",
    "/api/v1/auth/register",
    {
      body: { email: adminEmail, password: "secret123", firstName: "Admin" },
    },
  );
  await grantPermissions(api.db, registered.body.id, ALL);
  const login = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
    body: { email: adminEmail, password: "secret123" },
  });
  adminToken = login.body.token;

  const userEmail = `plain-${counter}@example.com`;
  const plain = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/register", {
    body: { email: userEmail, password: "secret123", firstName: "Plain" },
  });
  plainUserId = plain.body.id;
  const userLogin = await apiFetch(api.baseUrl, "POST", "/api/v1/auth/login", {
    body: { email: userEmail, password: "secret123" },
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await api.close();
});

const admin = (method, path, opts = {}) =>
  apiFetch(api.baseUrl, method, path, { token: adminToken, ...opts });

describe("users authorization", () => {
  it("rejects unauthenticated listing", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/users", {});
    expect(res.status).toBe(401);
  });

  it("rejects users without user:read", async () => {
    const res = await apiFetch(api.baseUrl, "GET", "/api/v1/users", {
      token: userToken,
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("AUTHORIZATION_ERROR");
  });
});

describe("GET /api/v1/users", () => {
  it("lists users without ever exposing password hashes", async () => {
    const res = await admin("GET", "/api/v1/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    for (const user of res.body) {
      expect(user).not.toHaveProperty("password_hash");
      expect(user).not.toHaveProperty("passwordHash");
    }
  });

  it("finds a user by id with roles", async () => {
    const res = await admin("GET", `/api/v1/users/${plainUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(plainUserId);
    expect(res.body).not.toHaveProperty("password_hash");
  });

  it("returns 404 for unknown users", async () => {
    expect(await admin("GET", "/api/v1/users/999999")).toMatchObject({
      status: 404,
    });
  });
});

describe("POST /api/v1/users/:id/promote", () => {
  it("promotes a user to admin", async () => {
    const res = await admin("POST", `/api/v1/users/${plainUserId}/promote`, {
      body: { role: "admin" },
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: plainUserId, role: "admin" });

    const fetched = await admin("GET", `/api/v1/users/${plainUserId}`);
    expect(fetched.body.roles).toContain("admin");
  });

  it("rejects duplicate promotion with 409", async () => {
    const res = await admin("POST", `/api/v1/users/${plainUserId}/promote`, {
      body: { role: "admin" },
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
  });

  it("rejects unknown users and unknown roles with 404", async () => {
    expect(
      await admin("POST", "/api/v1/users/999999/promote", {
        body: { role: "admin" },
      }),
    ).toMatchObject({ status: 404 });
    const target = await api.db.query(
      "INSERT INTO users (email, password_hash, first_name) VALUES ($1, $2, $3) RETURNING id",
      [`promote-${++counter}@example.com`, "hash", "Promote"],
    );
    expect(
      await admin(`POST`, `/api/v1/users/${target.rows[0].id}/promote`, {
        body: { role: "nope" },
      }),
    ).toMatchObject({ status: 404 });
  });

  it("rejects promoting without user:write", async () => {
    const res = await apiFetch(
      api.baseUrl,
      "POST",
      `/api/v1/users/${plainUserId}/promote`,
      { token: userToken, body: { role: "admin" } },
    );
    expect(res.status).toBe(403);
  });

  it("validates the role field", async () => {
    const res = await admin("POST", `/api/v1/users/${plainUserId}/promote`, {
      body: {},
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
