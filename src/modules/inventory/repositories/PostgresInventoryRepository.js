export class PostgresInventoryRepository {
  constructor(db) {
    this.db = db
  }
  async findByProduct(id) {
    const r = await this.db.query(
      'SELECT * FROM inventory WHERE product_id = $1',
      [id],
    )
    return r.rows[0] || null
  }
  async adjustQuantity(productId, qty) {
    await this.db.query(
      'UPDATE inventory SET quantity = $1, updated_at = now() WHERE product_id = $2',
      [qty, productId],
    )
  }
}
