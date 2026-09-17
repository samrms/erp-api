export class BaseController {
  constructor() {}
  create(req, res, next) {
    throw new Error("create must be implemented");
  }
  findAll(req, res, next) {
    throw new Error("findAll must be implemented");
  }
  findById(req, res, next) {
    throw new Error("findById must be implemented");
  }
  update(req, res, next) {
    throw new Error("update must be implemented");
  }
  delete(req, res, next) {
    throw new Error("delete must be implemented");
  }
}
