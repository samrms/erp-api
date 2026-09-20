export class InMemoryTransactionManager {
  async run(fn) {
    return fn();
  }
}
