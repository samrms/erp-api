import express from 'express'
import { UserController } from '../controllers/UserController.js'
import { UserService } from '../services/UserService.js'
import { PostgresUserRepository } from '../repositories/PostgresUserRepository.js'

export function userRoutes(container) {
  const router = express.Router()
  const repo = new PostgresUserRepository(container.database)
  const s = new UserService(repo)
  const c = new UserController(s)
  router.get('/', c.findMany)
  router.get('/:id', c.findById)
  router.patch('/:id', c.update)
  return router
}
