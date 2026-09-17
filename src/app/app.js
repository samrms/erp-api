import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { errorHandler } from './errorHandler.js'
import { HealthController } from './HealthController.js'
import { ReadyController } from './ReadyController.js'

export class App {
  constructor(container) {
    this.container = container
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  setupMiddleware() {
    this.app.use(express.json({ limit: '1mb' }))
    this.app.use(helmet())
    this.app.use(cors({ origin: this.container.config.corsOrigin }))
  }

  setupRoutes() {
    const health = new HealthController()
    const ready = new ReadyController(this.container.database)
    this.app.get('/health', health.check)
    this.app.get('/ready', (req, res, next) =>
      ready.check(req, res).catch(next),
    )
    this.app.get('/', (req, res) => res.json({ message: 'ERP API' }))
  }

  setupErrorHandling() {
    this.app.use(errorHandler)
  }

  getExpressApp() {
    return this.app
  }
}
