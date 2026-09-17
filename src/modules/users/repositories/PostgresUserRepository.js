export class PostgresUserRepositoryModule {
  constructor(db) {
    this.db = db
  }
  async findById(id) {
    const r = await this.db.query('SELECT * FROM users WHERE id=$1', [id])
    return r.rows[0] || null
  }
  async findMany() {
    const r = await this.db.query('SELECT * FROM users')
    return r.rows
  }
  async update(id, { email, role, active }) {
    const r = await this.db.query(
      'UPDATE users SET email=$1, role=$2, active=$3 WHERE id=$4 RETURNING *',
      [email, role, active, id],
    )
    return r.rows[0]
  }
}
