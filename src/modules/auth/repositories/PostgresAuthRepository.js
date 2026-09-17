import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresAuthRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async findByEmail(email) {
    const result = await this.database.query(
      "SELECT u.*, array_agg(DISTINCT r.name) as roles, array_agg(DISTINCT p.code) as permissions FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id LEFT JOIN role_permissions rp ON r.id = rp.role_id LEFT JOIN permissions p ON rp.permission_id = p.id WHERE u.email = $1 GROUP BY u.id",
      [email],
    );
    return result.rows[0] || null;
  }

  async create(email, passwordHash) {
    const result = await this.database.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, passwordHash],
    );
    return result.rows[0];
  }
}
