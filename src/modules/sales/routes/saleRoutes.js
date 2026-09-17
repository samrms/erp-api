import express from 'express'
export const saleRoutes = (controller) => {
  const router = express.Router()
  router.get('/', controller.findAll)
  router.get('/:id', controller.findById)
  router.post('/', controller.create)
  return router
}
