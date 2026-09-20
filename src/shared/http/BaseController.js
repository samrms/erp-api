export class BaseController {
  constructor() {}
  create(_req_req, _res_res, _next_next) {
    throw new Error("create must be implemented");
  }
  findAll(_req_req, _res_res, _next_next) {
    throw new Error("findAll must be implemented");
  }
  findById(_req_req, _res_res, _next_next) {
    throw new Error("findById must be implemented");
  }
  update(_req_req, _res_res, _next_next) {
    throw new Error("update must be implemented");
  }
  delete(_req_req, _res_res, _next_next) {
    throw new Error("delete must be implemented");
  }
}
