import express from 'express'
import { CustomerController } from '../controllers/CustomerController.js'
import { CustomerService } from '../services/CustomerService.js'
import { PostgresCustomerRepository } from '../repositories/PostgresCustomerRepository.js'

export function customerRoutes(container) {
  const router = express.Router()
  const repo = new PostgresCustomerRepository(container.database)
  const service = new CustomerService(repo)
  const controller = new CustomerController(service)
  router.get('/', controller.findMany)
  router.get('/:id', controller.findById)
  router.post('/', controller.create)
  router.patch('/:id', controller.update)
  return router
}
