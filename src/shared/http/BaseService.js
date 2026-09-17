export class BaseService {
  constructor() {}
  async execute(...args) {
    throw new Error("execute must be implemented");
  }
}
