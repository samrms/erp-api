import express from 'express'
export const productRoutes = (controller) => {
  const router = express.Router()
  router.post('/', controller.create)
  router.get('/', controller.findAll)
  router.get('/:id', controller.findById)
  router.patch('/:id', controller.update)
  router.delete('/:id', controller.delete)
  return router
}
