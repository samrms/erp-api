import { describe, it, expect, afterEach } from "vitest";
import { TokenStore } from "../../../src/infrastructure/security/TokenStore.js";

const stores = [];
function makeStore() {
  const store = new TokenStore();
  stores.push(store);
  return store;
}

afterEach(async () => {
  while (stores.length) await stores.pop().close();
});

describe("TokenStore", () => {
  it("reports unknown tokens as not revoked", async () => {
    expect(await makeStore().has("never-seen")).toBe(false);
  });

  it("reports blacklisted tokens as revoked", async () => {
    const store = makeStore();
    await store.add("token-1", 3600);
    expect(await store.has("token-1")).toBe(true);
    expect(await store.has("token-2")).toBe(false);
  });

  it("treats expired entries as not revoked and purges them", async () => {
    const store = makeStore();
    await store.add("stale", -1);
    expect(await store.has("stale")).toBe(false);
    expect(store.blacklist.has("stale")).toBe(false);
  });

  it("close clears the blacklist", async () => {
    const store = makeStore();
    await store.add("token-1", 3600);
    await store.close();
    stores.pop();
    expect(store.blacklist.size).toBe(0);
  });
});
