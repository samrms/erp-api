export class BaseLogger {
  info(_obj_obj) {
    throw new Error("info must be implemented");
  }
  warn(_obj_obj) {
    throw new Error("warn must be implemented");
  }
  error(_obj_obj) {
    throw new Error("error must be implemented");
  }
}
