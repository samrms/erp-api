import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";

export class PostgresUserRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    const columns = `u.id, u.email, u.first_name, u.last_name, u.created_at, u.updated_at,
              COALESCE(
                (SELECT array_agg(DISTINCT r.name) FROM user_roles ur
                 JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id),
                '{}'
              ) as roles`;
    if (search) {
      const res = await this.database.query(
        `SELECT ${columns} FROM users u WHERE u.email ILIKE $1 ORDER BY u.id LIMIT $2 OFFSET $3`,
        [`%${search}%`, lim, off],
      );
      return res.rows;
    }
    const res = await this.database.query(
      `SELECT ${columns} FROM users u ORDER BY u.id LIMIT $1 OFFSET $2`,
      [lim, off],
    );
    return res.rows;
  }

  async findById(id) {
    const res = await this.database.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.created_at, u.updated_at,
              COALESCE(
                (SELECT array_agg(DISTINCT r.name) FROM user_roles ur
                 JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id),
                '{}'
              ) as roles
       FROM users u
       WHERE u.id = $1`,
      [id],
    );
    return res.rows[0] || null;
  }

  async findRoleByName(name) {
    const res = await this.database.query(
      "SELECT * FROM roles WHERE name = $1",
      [name],
    );
    return res.rows[0] || null;
  }

  async assignRole(userId, roleId) {
    const existing = await this.database.query(
      "SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2",
      [userId, roleId],
    );
    if (existing.rows.length > 0) return false;
    try {
      await this.database.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userId, roleId],
      );
      return true;
    } catch (err) {
      if (err && err.code === "23505") return false;
      throw err;
    }
  }
}
