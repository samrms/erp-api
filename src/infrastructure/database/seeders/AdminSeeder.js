import { BaseSeeder } from "./BaseSeeder.js";

const ADMIN_PERMISSIONS = [
  "product:read",
  "customer:read",
  "supplier:read",
  "sale:read",
  "inventory:read",
  "job:read",
  "user:read",
  "user:write",
];

export class AdminSeeder extends BaseSeeder {
  constructor(database, passwordHasher) {
    super(database);
    this.passwordHasher = passwordHasher;
  }

  async execute() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return null;

    for (const code of ADMIN_PERMISSIONS) {
      await this.database.query(
        "INSERT INTO permissions (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING",
        [code, code],
      );
    }

    const roleRes = await this.database.query(
      "INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    );
    const roleId = roleRes.rows[0].id;

    await this.database.query(
      `INSERT INTO role_permissions (role_id, permission_id)
       SELECT $1, p.id FROM permissions p WHERE p.code = ANY($2)
       ON CONFLICT DO NOTHING`,
      [roleId, ADMIN_PERMISSIONS],
    );

    const existing = await this.database.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      await this.database.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [existing.rows[0].id, roleId],
      );
      return null;
    }

    const hash = await this.passwordHasher.hash(password);
    const created = await this.database.query(
      "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email",
      [email, hash, "Admin", "User"],
    );
    await this.database.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
      [created.rows[0].id, roleId],
    );
    return created.rows[0];
  }
}
