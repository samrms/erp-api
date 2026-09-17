import express from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import { JwtTokenProvider } from '../../../shared/security/JwtTokenProvider.js'
import { AuthService } from '../services/AuthService.js'
import { PostgresUserRepository } from '../repositories/PostgresUserRepository.js'
import { Argon2PasswordHasher } from '../../../shared/security/Argon2PasswordHasher.js'
import { Config } from '../../../config/config.js'
import {{ RateLimiter } from '../../../shared/security/RateLimiter.js'

export function authRoutes(container) {
  const router = express.Router()
  const repo = new PostgresUserRepository(container.database)
  const hasher = new Argon2PasswordHasher()
  const tokenProvider = new JwtTokenProvider(
    container.config.jwtSecret,
    container.config.jwtExpiresIn,
  )
  const service = new AuthService(repo, hasher, tokenProvider)
  const controller = new AuthController(service)
  const authMiddleware = new AuthMiddleware(tokenProvider)

  const limiter = new RateLimiter(container.config.rateLimitWindow, container.config.rateLimitMax)
  router.post('/register', limiter.middleware.bind(limiter), (req, res, next) =>  controller.register(req, res, next))))
  router.post('/login', limiter.middleware.bind(limiter), (req, res, next) => controller.login(req, res, next))
  router.get(
    '/me',
    authMiddleware.requireAuth.bind(authMiddleware),
    (req, res, next) => controller.me(req, res, next),
  )

  return router
}
