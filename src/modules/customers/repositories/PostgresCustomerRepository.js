import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresCustomerRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async findAll(query) {
    const { limit = 20, offset = 0, search = "" } = query || {};
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    if (search) {
      const res = await this.database.query(
        "SELECT * FROM customers WHERE name ILIKE $1 LIMIT $2 OFFSET $3",
        [`%${search}%`, lim, off],
      );
      return res.rows;
    }
    const res = await this.database.query(
      "SELECT * FROM customers LIMIT $1 OFFSET $2",
      [lim, off],
    );
    return res.rows;
  }

  async findById(id) {
    const res = await this.database.query(
      "SELECT * FROM customers WHERE id = $1",
      [id],
    );
    return res.rows[0] || null;
  }

  async create({ name, email, phone, address }) {
    const res = await this.database.query(
      "INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, address],
    );
    return res.rows[0];
  }

  async update(id, fields) {
    const allowed = ["name", "email", "phone", "address"];
    const entries = Object.entries(fields).filter(
      ([k, v]) => allowed.includes(k) && v !== undefined,
    );
    if (entries.length === 0) return this.findById(id);
    const set = entries.map(([k], i) => `${k} = $${i + 2}`).join(", ");
    const values = entries.map(([, v]) => v);
    const res = await this.database.query(
      `UPDATE customers SET ${set}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, ...values],
    );
    return res.rows[0];
  }

  async delete(id) {
    await this.database.query("DELETE FROM customers WHERE id = $1", [id]);
  }
}
