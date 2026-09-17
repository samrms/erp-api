import express from 'express'
import { SaleService } from '../services/SaleService.js'
import { SaleController } from '../controllers/SaleController.js'
import { PostgresSaleRepository } from '../repositories/PostgresSaleRepository.js'
import { TransactionManager } from '../../../infrastructure/database/TransactionManager.js'
import { InventoryService } from '../../inventory/services/InventoryService.js'
export function salesRoutes(container) {
  const router = express.Router()
  const tm = new TransactionManager(container.database)
  const invS = new InventoryService(container.database, tm)
  const s = new SaleService(container.database, tm, invS)
  const c = new SaleController(s)
  router.get('/', (req, res, next) => c.findMany(req, res, next))
  router.get('/:id', (req, res, next) => c.findById(req, res, next))
  router.post('/', (req, res, next) => c.create(req, res, next))
  return router
}
