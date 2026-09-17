export class BaseDomainModel {
  constructor(init = {}) {
    Object.assign(this, init);
  }
  validate() {
    throw new Error("validate must be implemented");
  }
  toJSON() {
    throw new Error("toJSON must be implemented");
  }
}
