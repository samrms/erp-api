export class BasePasswordHasher {
  async hash(_password_password) {
    throw new Error("hash must be implemented");
  }
  async verify(_hash_hash, _password_password) {
    throw new Error("verify must be implemented");
  }
}
