export class BaseMiddleware {
  constructor() {}
  handle(req, res, next) {
    throw new Error('handle must be implemented')
  }
}
