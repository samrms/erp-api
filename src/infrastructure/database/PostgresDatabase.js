import pg from 'pg'

export class PostgresDatabase {
  constructor(config) {
    this.config = config
    this.pool = new pg.Pool({ connectionString: config.databaseUrl })
  }

  async query(sql, params = []) {
    const result = await this.pool.query(sql, params)
    return result
  }

  async close() {
    await this.pool.end()
  }

  getPool() {
    return this.pool
  }
}
