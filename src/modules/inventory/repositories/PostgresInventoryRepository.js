import { BusinessRuleError } from "../../../shared/errors/BusinessRuleError.js";

import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresInventoryRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async getStock(productId, client) {
    const db = client || this.database;
    const res = await db.query(
      "SELECT quantity FROM inventory WHERE product_id = $1",
      [productId],
    );
    return res.rows[0] ? res.rows[0].quantity : 0;
  }

  async setStock(productId, quantity, client) {
    const db = client || this.database;
    await db.query(
      "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET quantity = $2, updated_at = now()",
      [productId, quantity],
    );
  }

  async deductStock(productId, quantity, client) {
    const db = client || this.database;
    const res = await db.query(
      "UPDATE inventory SET quantity = quantity - $2, updated_at = now() WHERE product_id = $1 AND quantity >= $2 RETURNING *",
      [productId, quantity],
    );
    if (res.rowCount === 0) {
      throw new BusinessRuleError(
        "Insufficient stock for product " + productId,
      );
    }
    return res.rows[0];
  }

  async adjustStock(productId, delta, client) {
    const db = client || this.database;
    if (delta > 0) {
      await db.query(
        "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET quantity = inventory.quantity + $2, updated_at = now()",
        [productId, delta],
      );
    } else if (delta < 0) {
      const res = await db.query(
        "UPDATE inventory SET quantity = quantity + $2, updated_at = now() WHERE product_id = $1 AND quantity + $2 >= 0 RETURNING *",
        [productId, delta],
      );
      if (res.rowCount === 0) {
        throw new BusinessRuleError(
          "Insufficient stock for product " + productId,
        );
      }
    }
    return this.getStock(productId, client);
  }

  async createMovement({ productId, quantity, movementType, reason }, client) {
    const db = client || this.database;
    await db.query(
      "INSERT INTO inventory_movements (product_id, quantity, movement_type, reason) VALUES ($1, $2, $3, $4)",
      [productId, quantity, movementType, reason],
    );
  }
}
