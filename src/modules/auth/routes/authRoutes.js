import express from 'express'
export const authRoutes = (controller, authMiddleware) => {
  const router = express.Router()
  router.post('/register', controller.register)
  router.post('/login', controller.login)
  return router
}
