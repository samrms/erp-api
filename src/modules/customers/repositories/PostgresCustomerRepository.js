import { BaseRepository } from '../../../shared/repositories/BaseRepository.js'
export class PostgresCustomerRepository extends BaseRepository {
  constructor(database) {
    super()
    this.database = database
  }
  async findAll(query) {
    const { limit = 20, offset = 0, search = '' } = query || {}
    if (search) {
      const res = await this.database.query(
        'SELECT * FROM customers WHERE name ILIKE $1 LIMIT $2 OFFSET $3',
        [`%${search}%`, limit, offset],
      )
      return res.rows
    }
    const res = await this.database.query(
      'SELECT * FROM customers LIMIT $1 OFFSET $2',
      [limit, offset],
    )
    return res.rows
  }
  async findById(id) {
    const res = await this.database.query(
      'SELECT * FROM customers WHERE id = $1',
      [id],
    )
    return res.rows[0] || null
  }
  async create({ name, email, phone, address }) {
    const res = await this.database.query(
      'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, address],
    )
    return res.rows[0]
  }
  async update(id, fields) {
    const keys = Object.keys(fields)
    const set = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')
    const res = await this.database.query(
      `UPDATE customers SET ${set} WHERE id = $1 RETURNING *`,
      [id, ...Object.values(fields)],
    )
    return res.rows[0]
  }
  async delete(id) {
    await this.database.query('DELETE FROM customers WHERE id = $1', [id])
  }
}
