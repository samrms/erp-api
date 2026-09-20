import { BaseSeeder } from "./BaseSeeder.js";

export class InventorySeeder extends BaseSeeder {
  async execute() {
    const prods = await this.database.query(
      "SELECT id FROM products ORDER BY id",
    );
    for (const { id } of prods.rows) {
      const qty = Math.floor(Math.random() * 200) + 50;
      await this.database.query(
        "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO NOTHING",
        [id, qty],
      );
    }
    return prods.rows.length;
  }
}
