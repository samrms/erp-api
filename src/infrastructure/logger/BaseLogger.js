export class BaseLogger {
  info(obj) {
    throw new Error("info must be implemented");
  }
  warn(obj) {
    throw new Error("warn must be implemented");
  }
  error(obj) {
    throw new Error("error must be implemented");
  }
}
