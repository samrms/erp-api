export class BaseWorker {
  constructor() {}
  async start() {
    throw new Error('start must be implemented')
  }
  async stop() {
    throw new Error('stop must be implemented')
  }
  async close() {
    throw new Error('close must be implemented')
  }
}
