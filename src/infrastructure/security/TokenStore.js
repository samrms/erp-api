export class TokenStore {
  constructor() {
    this.blacklist = new Map();

    this._cleanupInterval = setInterval(() => this._cleanup(), 10 * 60 * 1000);
  }

  async add(token, ttlSeconds) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.blacklist.set(token, expiresAt);
  }

  async has(token) {
    const expiresAt = this.blacklist.get(token);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.blacklist.delete(token);
      return false;
    }
    return true;
  }

  _cleanup() {
    const now = Date.now();
    for (const [token, expiresAt] of this.blacklist) {
      if (now > expiresAt) {
        this.blacklist.delete(token);
      }
    }
  }

  async close() {
    clearInterval(this._cleanupInterval);
    this.blacklist.clear();
  }
}
