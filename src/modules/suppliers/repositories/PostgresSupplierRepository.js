export class PostgresSupplierRepository {
  constructor(db) {
    this.db = db
  }
  async findById(id) {
    const r = await this.db.query('SELECT * FROM suppliers WHERE id=$1', [id])
    return r.rows[0] || null
  }
  async create({ name, email, phone }) {
    const r = await this.db.query(
      'INSERT INTO suppliers (name,email,phone) VALUES ($1,$2,$3) RETURNING *',
      [name, email, phone],
    )
    return r.rows[0]
  }
  async findMany({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit
    const r = await this.db.query(
      'SELECT * FROM suppliers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    )
    return r.rows
  }
}
