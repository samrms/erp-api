import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresInventoryRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }
  async getStock(productId) {
    const res = await this.database.query(
      "SELECT * FROM inventory WHERE product_id = $1",
      [productId],
    );
    return res.rows[0] ? res.rows[0].quantity : 0;
  }
  async setStock(productId, quantity, client) {
    const db = client || this.database;
    await db.query(
      "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET quantity = EXCLUDED.quantity",
      [productId, quantity],
    );
  }
  async deductStock(productId, quantity, client) {
    const db = client || this.database;
    const res = await db.query(
      "UPDATE inventory SET quantity = quantity - $2 WHERE product_id = $1 AND quantity >= $2 RETURNING *",
      [productId, quantity],
    );
    if (res.rowCount === 0) throw new Error("Insufficient stock");
    return res.rows[0];
  }
  async createMovement({ productId, quantity, movementType, reason }, client) {
    const db = client || this.database;
    await db.query(
      "INSERT INTO inventory_movements (product_id, quantity, movement_type, reason) VALUES ($1, $2, $3, $4)",
      [productId, quantity, movementType, reason],
    );
  }
}
