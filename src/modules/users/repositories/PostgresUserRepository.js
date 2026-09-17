import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresUserRepository extends BaseRepository {
  constructor(database) {
    super(database);
  }
  async findByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }
  async create(data) {
    const result = await this.query('INSERT INTO users (email, password_hash, roles, permissions) VALUES ($1, $2, $3, $4) RETURNING *', [data.email, data.passwordHash, data.roles || [], data.permissions || []]);
    return result.rows[0];
  }
  async findById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}
