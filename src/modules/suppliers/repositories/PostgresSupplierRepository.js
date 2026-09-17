import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresSupplierRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }
  async findAll(query) {
    const { limit = 20, offset = 0, search = "" } = query || {};
    if (search) {
      const res = await this.database.query(
        "SELECT * FROM suppliers WHERE name ILIKE $1 LIMIT $2 OFFSET $3",
        [`%${search}%`, limit, offset],
      );
      return res.rows;
    }
    const res = await this.database.query(
      "SELECT * FROM suppliers LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return res.rows;
  }
  async findById(id) {
    const res = await this.database.query(
      "SELECT * FROM suppliers WHERE id = $1",
      [id],
    );
    return res.rows[0] || null;
  }
  async create({ name, email, phone }) {
    const res = await this.database.query(
      "INSERT INTO suppliers (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone],
    );
    return res.rows[0];
  }
  async update(id, fields) {
    const keys = Object.keys(fields);
    const set = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const res = await this.database.query(
      `UPDATE suppliers SET ${set} WHERE id = $1 RETURNING *`,
      [id, ...Object.values(fields)],
    );
    return res.rows[0];
  }
  async delete(id) {
    await this.database.query("DELETE FROM suppliers WHERE id = $1", [id]);
  }
}
