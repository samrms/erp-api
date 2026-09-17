import { Config } from '../config/config.js'
import { PostgresDatabase } from '../infrastructure/database/PostgresDatabase.js'
import { Logger } from '../infrastructure/logger/Logger.js'
import { App } from './app.js'
import { HttpServer } from '../infrastructure/http/HttpServer.js'
import { Argon2PasswordHasher } from '../shared/security/Argon2PasswordHasher.js'
import { JwtTokenProvider } from '../shared/security/JwtTokenProvider.js'
import { PostgresUserRepository } from '../modules/auth/repositories/PostgresUserRepository.js'
import { AuthService } from '../modules/auth/services/AuthService.js'
import { AuthController } from '../modules/auth/controllers/AuthController.js'
import { AuthMiddleware } from '../modules/auth/middleware/AuthMiddleware.js'
import { RateLimiter } from '../shared/security/RateLimiter.js'

export class ApplicationContainer {
  constructor() {
    this.config = new Config()
    this.logger = new Logger()
    this.database = new PostgresDatabase(this.config)
    this.app = new App(this)
    this.httpServer = new HttpServer(this.app.getExpressApp(), this.config.port)

    const userRepo = new PostgresUserRepository(this.database)
    const passwordHasher = new Argon2PasswordHasher()
    const tokenProvider = new JwtTokenProvider(
      this.config.jwtSecret,
      this.config.jwtExpiresIn,
    )
    this.authService = new AuthService(userRepo, passwordHasher, tokenProvider)
    this.authController = new AuthController(this.authService)
    this.authMiddleware = new AuthMiddleware(tokenProvider)
    this.authRateLimiter = new RateLimiter(
      this.config.rateLimitWindow,
      this.config.rateLimitMax,
    )
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
