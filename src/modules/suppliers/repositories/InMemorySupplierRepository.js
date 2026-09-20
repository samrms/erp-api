export class InMemorySupplierRepository {
  constructor(store) {
    this.store = store;
  }

  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    let suppliers = this.store.suppliers;
    if (search) {
      const q = search.toLowerCase();
      suppliers = suppliers.filter((s) => s.name.toLowerCase().includes(q));
    }
    return suppliers.slice(offset, offset + limit);
  }

  async findById(id) {
    return this.store.suppliers.find((s) => s.id === id) || null;
  }

  async create({ name, email, phone }) {
    const id = this.store._uuid();
    const now = this.store._now();
    const supplier = {
      id,
      name,
      email: email || null,
      phone: phone || null,
      created_at: now,
      updated_at: now,
    };
    this.store.suppliers.push(supplier);
    return supplier;
  }

  async update(id, fields) {
    const supplier = this.store.suppliers.find((s) => s.id === id);
    if (!supplier) return null;
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) supplier[k] = v;
    }
    supplier.updated_at = this.store._now();
    return supplier;
  }

  async delete(id) {
    this.store.suppliers = this.store.suppliers.filter((s) => s.id !== id);
  }
}
