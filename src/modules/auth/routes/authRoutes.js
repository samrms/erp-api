import express from 'express'

export function authRoutes(container) {
  const router = express.Router()
  const controller = container.authController
  const authMiddleware = container.authMiddleware
  const limiter = container.authRateLimiter

  router.post('/register', limiter.middleware.bind(limiter), (req, res, next) =>
    controller.register(req, res, next),
  )
  router.post('/login', limiter.middleware.bind(limiter), (req, res, next) =>
    controller.login(req, res, next),
  )
  router.get(
    '/me',
    authMiddleware.requireAuth.bind(authMiddleware),
    controller.me,
  )
  return router
}
