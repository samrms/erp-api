import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";

let api;
let counter = 0;
const email = () => `auth-${++counter}@example.com`;

beforeAll(async () => {
  api = await startTestApi("api-auth");
});

afterAll(async () => {
  await api.close();
});

const post = (path, opts) => apiFetch(api.baseUrl, "POST", path, opts);

describe("POST /api/v1/auth/register", () => {
  it("creates a user and never returns the password hash", async () => {
    const res = await post("/api/v1/auth/register", {
      body: {
        email: email(),
        password: "secret123",
        firstName: "Ada",
        lastName: "Lovelace",
      },
    });
    expect(res.status).toBe(201);
    expect(res.body.email).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(JSON.stringify(res.body)).not.toContain("secret123");
    expect(res.body).not.toHaveProperty("password_hash");
  });

  it("rejects duplicate emails without distinguishing the reason", async () => {
    const dup = email();
    await post("/api/v1/auth/register", {
      body: { email: dup, password: "secret123", firstName: "A" },
    });
    const res = await post("/api/v1/auth/register", {
      body: { email: dup, password: "secret123", firstName: "B" },
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("AUTHENTICATION_ERROR");
  });

  it("validates input with per-field details", async () => {
    const res = await post("/api/v1/auth/register", {
      body: { email: "not-an-email", password: "123" },
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    const fields = res.body.error.details.map((d) => d.field);
    expect(fields).toContain("email");
    expect(fields).toContain("password");
  });
});

describe("POST /api/v1/auth/login", () => {
  it("returns a token for valid credentials", async () => {
    const address = email();
    await post("/api/v1/auth/register", {
      body: { email: address, password: "secret123", firstName: "Grace" },
    });
    const res = await post("/api/v1/auth/login", {
      body: { email: address, password: "secret123" },
    });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user.email).toBe(address);
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("rejects wrong passwords and unknown emails identically", async () => {
    const address = email();
    await post("/api/v1/auth/register", {
      body: { email: address, password: "secret123", firstName: "Alan" },
    });
    const wrong = await post("/api/v1/auth/login", {
      body: { email: address, password: "wrong-password" },
    });
    const unknown = await post("/api/v1/auth/login", {
      body: { email: "ghost@example.com", password: "wrong-password" },
    });
    for (const res of [wrong, unknown]) {
      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("Invalid credentials");
    }
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("revokes the token so it cannot be reused", async () => {
    const address = email();
    await post("/api/v1/auth/register", {
      body: { email: address, password: "secret123", firstName: "Linus" },
    });
    const login = await post("/api/v1/auth/login", {
      body: { email: address, password: "secret123" },
    });
    const token = login.body.token;

    const logout = await post("/api/v1/auth/logout", { token });
    expect(logout.status).toBe(200);

    // Token must be accepted by the middleware shape (valid JWT) but revoked:
    // use it against a protected endpoint.
    const reused = await apiFetch(api.baseUrl, "GET", "/api/v1/products", {
      token,
    });
    expect(reused.status).toBe(401);
    expect(reused.body.error.message).toBe("Token has been revoked");
  });

  it("requires authentication", async () => {
    const res = await post("/api/v1/auth/logout", {});
    expect(res.status).toBe(401);
  });
});

describe("POST /api/v1/auth/change-password", () => {
  async function registerAndLogin() {
    const address = email();
    await post("/api/v1/auth/register", {
      body: { email: address, password: "old-secret", firstName: "Ken" },
    });
    const login = await post("/api/v1/auth/login", {
      body: { email: address, password: "old-secret" },
    });
    return { address, token: login.body.token };
  }

  it("changes the password and invalidates the old one", async () => {
    const { address, token } = await registerAndLogin();
    const changed = await post("/api/v1/auth/change-password", {
      token,
      body: { currentPassword: "old-secret", newPassword: "new-secret" },
    });
    expect(changed.status).toBe(200);

    const oldLogin = await post("/api/v1/auth/login", {
      body: { email: address, password: "old-secret" },
    });
    expect(oldLogin.status).toBe(401);
    const newLogin = await post("/api/v1/auth/login", {
      body: { email: address, password: "new-secret" },
    });
    expect(newLogin.status).toBe(200);
  });

  it("rejects a wrong current password", async () => {
    const { token } = await registerAndLogin();
    const res = await post("/api/v1/auth/change-password", {
      token,
      body: { currentPassword: "wrong", newPassword: "new-secret" },
    });
    expect(res.status).toBe(401);
  });
});
