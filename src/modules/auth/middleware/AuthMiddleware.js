import { BaseMiddleware } from '../../shared/middleware/BaseMiddleware.js'
import { AuthenticationError } from '../../shared/errors/AuthenticationError.js'
export class AuthMiddleware extends BaseMiddleware {
  constructor(tokenProvider) {
    super()
    this.tokenProvider = tokenProvider
    this.handle = this.handle.bind(this)
  }

  async handle(req, res, next) {
    try {
      const authHeader = req.headers.authorization || ''
      const token = authHeader.replace('Bearer ', '').trim()
      if (!token) throw new AuthenticationError('Missing token')
      const payload = this.tokenProvider.verify(token)
      req.user = payload
      next()
    } catch (error) {
      next(error)
    }
  }
}
