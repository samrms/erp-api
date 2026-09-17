export function createProduct(overrides = {}) {
  return { id: 1, name: "P", price: 10, ...overrides };
}
