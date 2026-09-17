import { AuthorizationError } from '../../shared/errors/AuthorizationError.js'

export class RBACMiddleware {
  constructor() {
    this.requirePermission = (resource, action) => {
      return (req, res, next) => {
        // Minimal RBAC: check role for demonstration; real permissions from DB
        const role = req.user?.role
        if (role === 'admin') return next()
        if (role === 'manager' && action === 'read') return next()
        if (role === 'employee' && action === 'read' && resource !== 'users')
          return next()
        return next(new AuthorizationError('Insufficient permissions'))
      }
    }
  }
}
