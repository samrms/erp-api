export class BaseJobQueue {
  constructor(config) {
    this.config = config || {};
  }
  async add(_type_type, _payload_payload) {
    throw new Error("add must be implemented");
  }
  async close() {
    throw new Error("close must be implemented");
  }
}
