import pg from "pg";
import { BaseDatabase } from "./BaseDatabase.js";
export class PostgresDatabase extends BaseDatabase {
  constructor(config) {
    super();
    this.pool = new pg.Pool({
      connectionString: config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }

  async getClient() {
    return this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }
}
