export class BaseDatabase {
  constructor(config) {
    this.config = config || {};
  }
  async query(_text_text, _params_params) {
    throw new Error("query must be implemented");
  }
  async getClient() {
    throw new Error("getClient must be implemented");
  }
  async close() {
    throw new Error("close must be implemented");
  }
}
