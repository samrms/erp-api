import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startTestApi, apiFetch } from "../../setup/api.js";
import {
  createCounters,
  createProduct,
  createCustomer,
  setStock,
} from "../../setup/factories.js";

let api;
let token;
let counters;

beforeAll(async () => {
  api = await startTestApi("api-concurrency");
  token = api.tokenFor(["sale:read", "inventory:read"]);
  counters = createCounters();
});

afterAll(async () => {
  await api.close();
});

describe("concurrent sales", () => {
  it("never oversells: stock stays non-negative and losers get 422", async () => {
    const product = await createProduct(api.db, counters, { price: "10.00" });
    const customer = await createCustomer(api.db, counters);
    await setStock(api.db, product.id, 10);

    const payload = {
      customerId: customer.id,
      items: [{ productId: product.id, quantity: 7 }],
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const [a, b] = await Promise.all(
      [payload, payload].map((body) =>
        fetch(`${api.baseUrl}/api/v1/sales`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }).then(async (res) => ({ status: res.status })),
      ),
    );

    // Exactly one winner and one loser, regardless of scheduling
    expect([a.status, b.status].sort()).toEqual([201, 422]);

    // Invariant: 10 - 7 = 3 in stock, exactly one sale with one line item
    const stock = await api.db.query(
      "SELECT quantity FROM inventory WHERE product_id = $1",
      [product.id],
    );
    expect(stock.rows[0].quantity).toBe(3);
    const sales = await api.db.query(
      "SELECT COUNT(*) AS c FROM sales WHERE customer_id = $1",
      [customer.id],
    );
    expect(sales.rows[0].c).toBe("1");
    const items = await api.db.query(
      "SELECT COALESCE(SUM(quantity), 0) AS sold FROM sale_items WHERE product_id = $1",
      [product.id],
    );
    expect(Number(items.rows[0].sold)).toBe(7);
  });

  it("concurrent registrations for the same email create exactly one user", async () => {
    const address = "race@example.com";
    const results = await Promise.all(
      [1, 2].map(() =>
        apiFetch(api.baseUrl, "POST", "/api/v1/auth/register", {
          body: { email: address, password: "secret123", firstName: "Race" },
        }),
      ),
    );
    expect(results.map((r) => r.status).sort()).toEqual([201, 401]);
    const count = await api.db.query(
      "SELECT COUNT(*) AS c FROM users WHERE email = $1",
      [address],
    );
    expect(count.rows[0].c).toBe("1");
  });
});
