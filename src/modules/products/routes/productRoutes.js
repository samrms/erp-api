import express from 'express'
import { ProductController } from '../controllers/ProductController.js'
import { ProductService } from '../services/ProductService.js'
import { PostgresProductRepository } from '../repositories/PostgresProductRepository.js'

export function productRoutes(container) {
  const router = express.Router()
  const repo = new PostgresProductRepository(container.database)
  const service = new ProductService(repo)
  const controller = new ProductController(service)

  router.get('/', controller.findMany)
  router.get('/:id', controller.findById)
  router.post('/', controller.create)
  router.patch('/:id', controller.update)
  router.delete('/:id', controller.deactivate)
  return router
}
