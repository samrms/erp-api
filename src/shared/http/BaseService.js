export class BaseService {
  constructor() {}
  async execute(..._args_args) {
    throw new Error("execute must be implemented");
  }
}
