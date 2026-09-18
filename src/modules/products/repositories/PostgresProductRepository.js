import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";

const LIST_TTL = 30;
const ITEM_TTL = 60;

export class PostgresProductRepository extends BaseRepository {
  constructor(database, cache = null) {
    super();
    this.database = database;
    this.cache = cache;
  }

  async findAll({
    limit = 20,
    offset = 0,
    sortField = "id",
    sortOrder = "asc",
    search = "",
  } = {}) {
    const allowedFields = {
      id: "id",
      name: "name",
      price: "price",
      created_at: "created_at",
    };
    const sf = allowedFields[sortField] || "id";
    const so = sortOrder === "desc" ? "DESC" : "ASC";
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    if (!this.cache) {
      return this._queryAll(sf, so, lim, off, search);
    }
    const gen = (await this.cache.get("products:gen")) ?? "0";
    const key = `products:list:${gen}:${lim}:${off}:${sf}:${so}:${search}`;
    const hit = await this.cache.get(key);
    if (hit !== null) return hit;
    const rows = await this._queryAll(sf, so, lim, off, search);
    await this.cache.set(key, rows, LIST_TTL);
    return rows;
  }

  async _queryAll(sf, so, lim, off, search) {
    if (search) {
      const res = await this.database.query(
        `SELECT * FROM products WHERE name ILIKE $1 ORDER BY ${sf} ${so} LIMIT $2 OFFSET $3`,
        [`%${search}%`, lim, off],
      );
      return res.rows;
    }
    const res = await this.database.query(
      `SELECT * FROM products ORDER BY ${sf} ${so} LIMIT $1 OFFSET $2`,
      [lim, off],
    );
    return res.rows;
  }

  async findById(id) {
    if (!this.cache) {
      return this._queryById(id);
    }
    const key = `product:${id}`;
    const hit = await this.cache.get(key);
    if (hit !== null) return hit;
    const row = await this._queryById(id);
    if (row) await this.cache.set(key, row, ITEM_TTL);
    return row;
  }

  async _queryById(id) {
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
    await this.cache?.incr("products:gen");
    return res.rows[0];
  }

  async update(id, fields) {
    const allowed = ["name", "description", "price"];
    const entries = Object.entries(fields).filter(
      ([k, v]) => allowed.includes(k) && v !== undefined,
    );
    if (entries.length === 0) return this.findById(id);
    const set = entries.map(([k], i) => `${k} = $${i + 2}`).join(", ");
    const values = entries.map(([, v]) => v);
    const res = await this.database.query(
      `UPDATE products SET ${set}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, ...values],
    );
    await this.cache?.del(`product:${id}`);
    await this.cache?.incr("products:gen");
    return res.rows[0];
  }

  async delete(id) {
    await this.database.query("DELETE FROM products WHERE id = $1", [id]);
    await this.cache?.del(`product:${id}`);
    await this.cache?.incr("products:gen");
  }
}
