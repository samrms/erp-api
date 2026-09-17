export class BaseTokenProvider {
  sign(payload) {
    throw new Error('sign must be implemented')
  }
  verify(token) {
    throw new Error('verify must be implemented')
  }
}
