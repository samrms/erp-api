export class BaseMiddleware {
  constructor() {}
  handle(_req_req, _res_res, _next_next) {
    throw new Error("handle must be implemented");
  }
}
