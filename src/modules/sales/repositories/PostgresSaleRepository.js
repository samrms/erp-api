export class PostgresSaleRepository {
  constructor(db) {
    this.db = db
  }
  async findById(id) {
    const r = await this.db.query('SELECT * FROM sales WHERE id=$1', [id])
    return r.rows[0] || null
  }
  async create({ customerId, userId, total }) {
    const r = await this.db.query(
      'INSERT INTO sales (customer_id,user_id,total) VALUES ($1,$2,$3) RETURNING *',
      [customerId, userId || null, total],
    )
    return r.rows[0]
  }
}
