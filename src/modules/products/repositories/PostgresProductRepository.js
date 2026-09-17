import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresProductRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async findAll({
    limit = 20,
    offset = 0,
    sortField = "id",
    sortOrder = "asc",
    search = "",
  }) {
    const allowed = {
      id: "id",
      name: "name",
      price: "price",
      created_at: "created_at",
    };
    const sf = allowed[sortField] || "id";
    const so = sortOrder === "desc" ? "DESC" : "ASC";
    if (search) {
      const res = await this.database.query(
        `SELECT * FROM products WHERE name ILIKE $1 ORDER BY ${sf} ${so} LIMIT $2 OFFSET $3`,
        [`%${search}%`, limit, offset],
      );
      return res.rows;
    }
    const res = await this.database.query(
      `SELECT * FROM products ORDER BY ${sf} ${so} LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return res.rows;
  }

  async findById(id) {
    const res = await this.database.query(
      "SELECT * FROM products WHERE id = $1",
      [id],
    );
    return res.rows[0] || null;
  }

  async create({ sku, name, description, price }) {
    const res = await this.database.query(
      "INSERT INTO products (sku, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [sku, name, description, price],
    );
    return res.rows[0];
  }

  async update(id, fields) {
    const keys = Object.keys(fields);
    const set = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = Object.values(fields);
    const res = await this.database.query(
      `UPDATE products SET ${set} WHERE id = $1 RETURNING *`,
      [id, ...values],
    );
    return res.rows[0];
  }

  async delete(id) {
    await this.database.query("DELETE FROM products WHERE id = $1", [id]);
  }
}
