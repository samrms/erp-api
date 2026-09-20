export class InMemoryProductRepository {
  constructor(store, cache = null) {
    this.store = store;
    this.cache = cache;
  }

  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    let products = this.store.products;
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    return products.slice(offset, offset + limit);
  }

  async findById(id) {
    return this.store.products.find((p) => p.id === id) || null;
  }

  async create({ sku, name, description, price }) {
    const id = this.store._uuid();
    const now = this.store._now();
    const product = {
      id,
      sku,
      name,
      description: description || null,
      price: String(price),
      created_at: now,
      updated_at: now,
    };
    this.store.products.push(product);
    return product;
  }

  async update(id, fields) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) return null;
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) product[k] = k === "price" ? String(v) : v;
    }
    product.updated_at = this.store._now();
    return product;
  }

  async delete(id) {
    this.store.products = this.store.products.filter((p) => p.id !== id);
  }
}
