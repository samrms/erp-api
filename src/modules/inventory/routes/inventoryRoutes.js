import express from 'express'
import { InventoryController } from '../controllers/InventoryController.js'
import { InventoryService } from '../services/InventoryService.js'
import { TransactionManager } from '../../../infrastructure/database/TransactionManager.js'
export function inventoryRoutes(container) {
  const router = express.Router()
  const tm = new TransactionManager(container.database)
  const s = new InventoryService(container.database, tm)
  const c = new InventoryController(s)
  router.post('/adjustments', c.adjust)
  return router
}
