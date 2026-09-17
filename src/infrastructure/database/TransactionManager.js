export class TransactionManager {
  constructor(database) {
    this.database = database
  }

  async run(callback) {
    const client = await this.database.getPool().connect()
    try {
      await client.query('BEGIN')
      const result = await callback({
        query: (sql, params) => client.query(sql, params),
      })
      await client.query('COMMIT')
      return result
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
