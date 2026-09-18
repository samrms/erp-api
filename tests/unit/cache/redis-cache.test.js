import { describe, it, expect, vi } from "vitest";
import { RedisCache } from "../../../src/infrastructure/cache/RedisCache.js";

function fakeClientFactory(store, hooks = {}) {
  return () => ({
    on: () => {},
    connect: hooks.connect || (async () => {}),
    get: async (key) => (store.has(key) ? store.get(key) : null),
    setEx: async (key, ttl, value) => {
      hooks.seenTtl?.(ttl);
      store.set(key, value);
    },
    del: async (keys) => {
      for (const key of keys) store.delete(key);
    },
    incr: async (key) => {
      const next = Number(store.get(key) ?? 0) + 1;
      store.set(key, String(next));
      return next;
    },
    quit: async () => {},
    disconnect: async () => {},
  });
}

const config = { redisUrl: "redis://localhost:6379" };

describe("RedisCache", () => {
  it("round-trips JSON values under a namespaced key with TTL", async () => {
    const store = new Map();
    let ttl = null;
    const cache = new RedisCache(
      config,
      fakeClientFactory(store, { seenTtl: (t) => (ttl = t) }),
    );
    await cache.set("product:1", { id: 1, name: "Widget" }, 60);
    expect(ttl).toBe(60);
    expect(store.has("erp:product:1")).toBe(true);
    expect(await cache.get("product:1")).toEqual({ id: 1, name: "Widget" });
    await cache.close();
  });

  it("returns null on cache misses", async () => {
    const cache = new RedisCache(config, fakeClientFactory(new Map()));
    expect(await cache.get("missing")).toBeNull();
    await cache.close();
  });

  it("deletes keys and increments counters", async () => {
    const store = new Map();
    const cache = new RedisCache(config, fakeClientFactory(store));
    await cache.set("a", 1, 60);
    await cache.set("b", 2, 60);
    await cache.del("a", "b");
    expect(await cache.get("a")).toBeNull();
    expect(await cache.incr("gen")).toBe(1);
    expect(await cache.incr("gen")).toBe(2);
    await cache.close();
  });

  it("fails open when Redis is unreachable", async () => {
    const cache = new RedisCache(config, () => ({
      on: () => {},
      connect: async () => {
        throw new Error("ECONNREFUSED");
      },
      disconnect: async () => {},
    }));
    expect(await cache.get("x")).toBeNull();
    await expect(cache.set("x", 1, 60)).resolves.toBeUndefined();
    await expect(cache.del("x")).resolves.toBeUndefined();
    expect(await cache.incr("x")).toBeNull();
    await cache.close();
  });

  it("coalesces concurrent connection attempts and backs off after failure", async () => {
    let connects = 0;
    const cache = new RedisCache(config, () => ({
      on: () => {},
      connect: async () => {
        connects += 1;
        throw new Error("down");
      },
      disconnect: async () => {},
    }));
    await Promise.all([cache.get("a"), cache.get("b"), cache.set("c", 1, 1)]);
    expect(connects).toBe(1);
    await cache.close();
  });
});
