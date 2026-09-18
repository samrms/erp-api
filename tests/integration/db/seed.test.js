import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createIsolatedDb } from "../../setup/db.js";
import { seedAdmin } from "../../../src/infrastructure/database/seed.js";
import { Argon2PasswordHasher } from "../../../src/infrastructure/security/Argon2PasswordHasher.js";

let db;
let closeDb;
const savedEmail = process.env.ADMIN_EMAIL;
const savedPassword = process.env.ADMIN_PASSWORD;

beforeAll(async () => {
  const isolated = await createIsolatedDb("db-seed");
  db = isolated.database;
  closeDb = isolated.close;
});

afterAll(async () => {
  if (savedEmail === undefined) delete process.env.ADMIN_EMAIL;
  else process.env.ADMIN_EMAIL = savedEmail;
  if (savedPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = savedPassword;
  if (closeDb) await closeDb();
});

beforeEach(() => {
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
});

const deps = () => ({ database: db, passwordHasher: new Argon2PasswordHasher() });

describe("seedAdmin", () => {
  it("does nothing without admin credentials configured", async () => {
    expect(await seedAdmin(deps())).toBeNull();
    const users = await db.query("SELECT COUNT(*) AS c FROM users");
    expect(users.rows[0].c).toBe("0");
  });

  it("creates an admin user with the admin role and every permission", async () => {
    process.env.ADMIN_EMAIL = "root@example.com";
    process.env.ADMIN_PASSWORD = "root-secret";
    const seeded = await seedAdmin(deps());
    expect(seeded.email).toBe("root@example.com");

    const found = await db.query(
      `SELECT u.id, u.password_hash,
              (SELECT array_agg(r.name) FROM user_roles ur
               JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id) AS roles,
              (SELECT array_agg(DISTINCT p.code) FROM permissions p
               JOIN role_permissions rp ON p.id = rp.permission_id
               JOIN user_roles ur ON rp.role_id = ur.role_id
               WHERE ur.user_id = u.id) AS permissions
       FROM users u WHERE u.email = $1`,
      ["root@example.com"],
    );
    expect(found.rows[0].roles).toContain("admin");
    for (const code of ["product:read", "sale:read", "user:read", "user:write"]) {
      expect(found.rows[0].permissions).toContain(code);
    }
    const hasher = new Argon2PasswordHasher();
    expect(await hasher.verify(found.rows[0].password_hash, "root-secret")).toBe(true);
  }, 20000);

  it("is idempotent across restarts", async () => {
    process.env.ADMIN_EMAIL = "root@example.com";
    process.env.ADMIN_PASSWORD = "root-secret";
    expect(await seedAdmin(deps())).toBeNull();
    const users = await db.query("SELECT COUNT(*) AS c FROM users WHERE email = $1", [
      "root@example.com",
    ]);
    expect(users.rows[0].c).toBe("1");
  });
});
