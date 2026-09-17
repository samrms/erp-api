import express from 'express'
import { SupplierController } from '../controllers/SupplierController.js'
import { SupplierService } from '../services/SupplierService.js'
import { PostgresSupplierRepository } from '../repositories/PostgresSupplierRepository.js'
export function supplierRoutes(container) {
  const router = express.Router()
  const repo = new PostgresSupplierRepository(container.database)
  const service = new SupplierService(repo)
  const c = new SupplierController(service)
  router.get('/', c.findMany)
  router.get('/:id', c.findById)
  router.post('/', c.create)
  return router
}
