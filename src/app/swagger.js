import swaggerUi from 'swagger-ui-express'
import { OpenApiSpecification } from './openapi.js'

export function swaggerRoute(app) {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup({
      openapi: '3.0.0',
      info: { title: 'ERP API', version: '1.0.0' },
      paths: {},
    }),
  )
}
