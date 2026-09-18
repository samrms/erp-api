export class TransactionManager {
  constructor(database) {
    this.database = database;
  }

  async run(callback) {
    const client = await this.database.getClient();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
