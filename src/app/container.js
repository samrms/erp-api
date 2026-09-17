import { Config } from '../config/config.js'
import { PostgresDatabase } from '../infrastructure/database/PostgresDatabase.js'
import { Logger } from '../infrastructure/logger/Logger.js'
import { App } from './app.js'
import { HttpServer } from '../infrastructure/http/HttpServer.js'

export class ApplicationContainer {
  constructor() {
    this.config = new Config()
    this.logger = new Logger()
    this.database = new PostgresDatabase(this.config)
    this.app = new App(this)
    this.httpServer = new HttpServer(this.app.getExpressApp(), this.config.port)
  }

  async start() {
    await this.httpServer.start()
    this.logger.info('Server started', { port: this.config.port })
  }

  async stop() {
    await this.httpServer.stop()
    await this.database.close()
    this.logger.info('Server stopped')
  }
}
