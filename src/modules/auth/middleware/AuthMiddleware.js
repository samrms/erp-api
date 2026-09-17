import { AuthenticationError } from '../../shared/errors/AuthenticationError.js'

export class AuthMiddleware {
  constructor(tokenProvider) {
    this.tokenProvider = tokenProvider
  }

  requireAuth(req, res, next) {
    const header = req.headers.authorization || ''
    const parts = header.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AuthenticationError('Missing or invalid token'))
    }
    try {
      const payload = this.tokenProvider.verify(parts[1])
      req.user = payload
      next()
    } catch (e) {
      next(new AuthenticationError('Invalid token'))
    }
  }
}
