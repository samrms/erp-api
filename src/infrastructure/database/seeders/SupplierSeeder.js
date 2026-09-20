import { BaseSeeder } from "./BaseSeeder.js";

const SUPPLIERS = [
  {
    name: "TechParts Ltd",
    email: "sales@techparts.com",
    phone: "+1-555-0201",
  },
  {
    name: "Global Supplies",
    email: "orders@globalsupplies.com",
    phone: "+1-555-0202",
  },
  {
    name: "Prime Wholesale",
    email: "info@primewholesale.com",
    phone: "+1-555-0203",
  },
];

export class SupplierSeeder extends BaseSeeder {
  async execute() {
    for (const s of SUPPLIERS) {
      await this.database.query(
        "INSERT INTO suppliers (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [s.name, s.email, s.phone],
      );
    }
    return SUPPLIERS.length;
  }
}
