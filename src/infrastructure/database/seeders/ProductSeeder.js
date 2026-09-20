import { BaseSeeder } from "./BaseSeeder.js";

const PRODUCTS = [
  {
    sku: "WDG-001",
    name: "Widget A",
    price: 12.99,
    description: "Standard widget",
  },
  {
    sku: "WDG-002",
    name: "Widget B",
    price: 24.5,
    description: "Premium widget",
  },
  {
    sku: "GAD-001",
    name: "Gadget X",
    price: 49.99,
    description: "Multi-function gadget",
  },
  { sku: "GAD-002", name: "Gadget Y", price: 89.0, description: "Pro gadget" },
  { sku: "CBL-001", name: "Cable 2m", price: 7.5, description: "USB-C cable" },
  {
    sku: "CBL-002",
    name: "Cable 5m",
    price: 14.0,
    description: "Extended USB-C cable",
  },
  {
    sku: "ACC-001",
    name: "Adapter",
    price: 19.99,
    description: "Universal adapter",
  },
  { sku: "ACC-002", name: "Case", price: 34.0, description: "Protective case" },
];

export class ProductSeeder extends BaseSeeder {
  async execute() {
    for (const p of PRODUCTS) {
      await this.database.query(
        "INSERT INTO products (sku, name, price, description) VALUES ($1, $2, $3, $4) ON CONFLICT (sku) DO NOTHING",
        [p.sku, p.name, p.price, p.description],
      );
    }
    return PRODUCTS.length;
  }
}
