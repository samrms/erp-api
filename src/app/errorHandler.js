export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500
  const code = err.code || 'INTERNAL_ERROR'
  const message = err.message || 'Internal server error'

  const response = {
    error: { code, message },
  }

  if (err.details) {
    response.error.details = err.details
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(status).json(response)
}
