export class ReadyController {
  constructor(database) {
    this.database = database
  }

  async check(req, res) {
    try {
      await this.database.query('SELECT 1')
      res.json({ status: 'ready', database: 'ok' })
    } catch (e) {
      res.status(503).json({ status: 'not ready', database: 'down' })
    }
  }
}
