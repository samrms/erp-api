import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'ERP API', version: '1.0.0' },
    servers: [{ url: '/api/v1' }],
  },
  apis: ['./src/**/*.js'],
}

const spec = swaggerJsdoc(options)
export const Swagger = () => {
  const router = express.Router()
  router.use('/', swaggerUi.serve, swaggerUi.setup(spec))
  return router
}
