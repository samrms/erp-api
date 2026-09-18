import { createClient } from "redis";

const PREFIX = "erp:";
const COOLDOWN_MS = 5000;

export class RedisCache {
  constructor(config, createRedisClient = createClient) {
    this.redisUrl = config.redisUrl;
    this.createRedisClient = createRedisClient;
    this.client = null;
    this.connecting = null;
    this.downUntil = 0;
  }

  async _connected() {
    if (this.client) return this.client;
    if (Date.now() < this.downUntil) return null;
    if (!this.connecting) {
      this.connecting = this._open();
    }
    return this.connecting;
  }

  async _open() {
    const client = this.createRedisClient({
      url: this.redisUrl,
      socket: { connectTimeout: 1000 },
      disableOfflineQueue: true,
    });
    client.on("error", () => {});
    try {
      await client.connect();
      this.client = client;
      this.connecting = null;
      return client;
    } catch {
      this.connecting = null;
      this.downUntil = Date.now() + COOLDOWN_MS;
      try {
        await client.disconnect();
      } catch {}
      return null;
    }
  }

  async get(key) {
    const client = await this._connected();
    if (!client) return null;
    try {
      const raw = await client.get(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async set(key, value, ttlSeconds) {
    const client = await this._connected();
    if (!client) return;
    try {
      await client.setEx(PREFIX + key, ttlSeconds, JSON.stringify(value));
    } catch {}
  }

  async del(...keys) {
    const client = await this._connected();
    if (!client || keys.length === 0) return;
    try {
      await client.del(keys.map((k) => PREFIX + k));
    } catch {}
  }

  async incr(key) {
    const client = await this._connected();
    if (!client) return null;
    try {
      return await client.incr(PREFIX + key);
    } catch {
      return null;
    }
  }

  async close() {
    this.connecting = null;
    if (this.client) {
      const client = this.client;
      this.client = null;
      try {
        await client.quit();
      } catch {}
    }
  }
}
