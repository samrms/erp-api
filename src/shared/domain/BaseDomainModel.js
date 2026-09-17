export class BaseDomainModel {
  constructor(init = {}) {
    Object.assign(this, init);
  }
  touch() {
    this.updatedAt = new Date();
  }
  validate() {
    throw new Error("validate must be implemented");
  }
  toJSON() {
    throw new Error("toJSON must be implemented");
  }
}
