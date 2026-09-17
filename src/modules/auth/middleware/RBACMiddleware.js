import { BaseMiddleware } from "../../../shared/middleware/BaseMiddleware.js";
import { AuthorizationError } from "../../../shared/errors/AuthorizationError.js";
export class RBACMiddleware extends BaseMiddleware {
  constructor() {
    super();
    this.handle = this.handle.bind(this);
  }

  handle(permission) {
    return (req, res, next) => {
      try {
        const user = req.user || {};
        const userPermissions = user.permissions || [];
        if (!userPermissions.includes(permission)) {
          throw new AuthorizationError(`Requires ${permission}`);
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
