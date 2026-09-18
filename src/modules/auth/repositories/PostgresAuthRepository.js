import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresAuthRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async findByEmail(email) {
    const result = await this.database.query(
      `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.created_at, u.updated_at,
              COALESCE(
                (SELECT array_agg(DISTINCT r.name) FROM user_roles ur
                 JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id),
                '{}'
              ) as roles
       FROM users u
       WHERE u.email = $1`,
      [email],
    );
    const user = result.rows[0] || null;
    if (user) {
      user.permissions = await this.getPermissions(user.id);
    }
    return user;
  }

  async getPermissions(userId) {
    try {
      const result = await this.database.query(
        `SELECT DISTINCT p.code FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = $1`,
        [userId],
      );
      return result.rows.map((r) => r.code);
    } catch {
      return [];
    }
  }

  async findById(id) {
    const result = await this.database.query(
      "SELECT id, email, first_name, last_name, created_at, updated_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  async create({ email, passwordHash, firstName, lastName }) {
    const result = await this.database.query(
      "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at, updated_at",
      [email, passwordHash, firstName || "", lastName || null],
    );
    return result.rows[0];
  }

  async updatePassword(userId, passwordHash) {
    await this.database.query(
      "UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2",
      [passwordHash, userId],
    );
  }
}
