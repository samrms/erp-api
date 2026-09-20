export class InMemoryCustomerRepository {
  constructor(store) {
    this.store = store;
  }

  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    let customers = this.store.customers;
    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter((c) => c.name.toLowerCase().includes(q));
    }
    return customers.slice(offset, offset + limit);
  }

  async findById(id) {
    return this.store.customers.find((c) => c.id === id) || null;
  }

  async create({ name, email, phone, address }) {
    const id = this.store._uuid();
    const now = this.store._now();
    const customer = {
      id,
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
      created_at: now,
      updated_at: now,
    };
    this.store.customers.push(customer);
    return customer;
  }

  async update(id, fields) {
    const customer = this.store.customers.find((c) => c.id === id);
    if (!customer) return null;
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) customer[k] = v;
    }
    customer.updated_at = this.store._now();
    return customer;
  }

  async delete(id) {
    this.store.customers = this.store.customers.filter((c) => c.id !== id);
  }
}
