export class PostgresProductRepository {
  constructor(database) {
    this.db = database
  }

  async findById(id) {
    const res = await this.db.query('SELECT * FROM products WHERE id = $1', [
      id,
    ])
    return res.rows[0] || null
  }

  async findBySku(sku) {
    const res = await this.db.query('SELECT * FROM products WHERE sku = $1', [
      sku,
    ])
    return res.rows[0] || null
  }

  async findMany({ page = 1, limit = 20 } = {}) {
    const offset = (Math.max(1, page) - 1) * Math.min(100, limit)
    const res = await this.db.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [Math.min(100, limit), offset],
    )
    const totalRes = await this.db.query(
      'SELECT COUNT(*) AS total FROM products',
    )
    return {
      data: res.rows,
      pagination: {
        page,
        limit: Math.min(100, limit),
        total: parseInt(totalRes.rows[0].total, 10),
        totalPages: Math.ceil(
          parseInt(totalRes.rows[0].total, 10) / Math.min(100, limit),
        ),
      },
    }
  }

  async create({ sku, name, description, price, cost }) {
    const res = await this.db.query(
      'INSERT INTO products (sku, name, description, price, cost) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [sku, name, description, price, cost],
    )
    return res.rows[0]
  }

  async update(id, updates) {
    const fields = []
    const values = []
    let i = 1
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) {
        fields.push(`${k} = $${i}`)
        values.push(v)
        i++
      }
    }
    if (!fields.length) return this.findById(id)
    values.push(id)
    const res = await this.db.query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = now() WHERE id = $${i} RETURNING *`,
      values,
    )
    return res.rows[0]
  }

  async deactivate(id) {
    const res = await this.db.query(
      'UPDATE products SET active = false WHERE id = $1 RETURNING *',
      [id],
    )
    return res.rows[0]
  }
}
