import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresSaleRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }
  async create({ customerId, totalAmount }, client) {
    const db = client || this.database;
    const res = await db.query(
      "INSERT INTO sales (customer_id, total_amount) VALUES ($1, $2) RETURNING *",
      [customerId, totalAmount],
    );
    return res.rows[0];
  }
  async createItem(
    { saleId, productId, quantity, unitPrice, subtotal },
    client,
  ) {
    const db = client || this.database;
    await db.query(
      "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)",
      [saleId, productId, quantity, unitPrice, subtotal],
    );
  }
  async findById(id) {
    const res = await this.database.query("SELECT * FROM sales WHERE id = $1", [
      id,
    ]);
    return res.rows[0] || null;
  }
  async findAll(query) {
    const { limit = 20, offset = 0 } = query || {};
    const res = await this.database.query(
      "SELECT * FROM sales ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return res.rows;
  }
}
