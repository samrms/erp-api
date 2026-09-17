export class PostgresUserRepository {
  constructor(database) {
    this.db = database
  }

  async findById(id) {
    const res = await this.db.query('SELECT * FROM users WHERE id = $1', [id])
    return res.rows[0] || null
  }

  async findByEmail(email) {
    const res = await this.db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    return res.rows[0] || null
  }

  async create({ email, passwordHash, role }) {
    const res = await this.db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
      [email, passwordHash, role],
    )
    return res.rows[0]
  }
}
