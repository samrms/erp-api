export class PostgresCustomerRepository {
  constructor(db) {
    this.db = db
  }
  async findById(id) {
    const r = await this.db.query('SELECT * FROM customers WHERE id = $1', [id])
    return r.rows[0] || null
  }
  async create({ name, email, phone }) {
    const r = await this.db.query(
      'INSERT INTO customers (name, email, phone) VALUES ($1,$2,$3) RETURNING *',
      [name, email, phone],
    )
    return r.rows[0]
  }
  async findMany({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit
    const r = await this.db.query(
      'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    )
    return r.rows
  }
  async update(id, { name, email, phone, active }) {
    const r = await this.db.query(
      'UPDATE customers SET name=$1, email=$2, phone=$3, active=$4, updated_at=now() WHERE id=$5 RETURNING *',
      [name, email, phone, active, id],
    )
    return r.rows[0]
  }
}
