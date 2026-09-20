export class InMemorySaleRepository {
  constructor(store) {
    this.store = store;
  }

  async create({ customerId, totalAmount }) {
    const id = this.store._uuid();
    const sale = {
      id,
      customer_id: customerId,
      total_amount: String(totalAmount),
      created_at: this.store._now(),
    };
    this.store.sales.push(sale);
    return sale;
  }

  async createItem({ saleId, productId, quantity, unitPrice, subtotal }) {
    this.store.saleItems.push({
      id: this.store._uuid(),
      sale_id: saleId,
      product_id: productId,
      quantity,
      unit_price: String(unitPrice),
      subtotal: String(subtotal),
    });
  }

  async findById(id) {
    return this.store.sales.find((s) => s.id === id) || null;
  }

  async findAll({ limit = 20, offset = 0 } = {}) {
    return this.store.sales
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit);
  }
}
