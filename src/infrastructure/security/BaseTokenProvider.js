export class BaseTokenProvider {
  sign(_payload_payload) {
    throw new Error("sign must be implemented");
  }
  verify(_token_token) {
    throw new Error("verify must be implemented");
  }
}
