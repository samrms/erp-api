export class BasePasswordHasher {
  async hash(password) {
    throw new Error('hash must be implemented')
  }
  async verify(hash, password) {
    throw new Error('verify must be implemented')
  }
}
