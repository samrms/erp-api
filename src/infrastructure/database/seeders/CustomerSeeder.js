import { BaseSeeder } from "./BaseSeeder.js";

const CUSTOMERS = [
  { name: "Acme Corp", email: "billing@acme.com", phone: "+1-555-0101" },
  { name: "Globex", email: "finance@globex.com", phone: "+1-555-0102" },
  { name: "Initech", email: "ap@initech.com", phone: "+1-555-0103" },
  { name: "Umbrella Co", email: "orders@umbrella.com", phone: "+1-555-0104" },
  {
    name: "Stark Industries",
    email: "procurement@stark.com",
    phone: "+1-555-0105",
  },
];

export class CustomerSeeder extends BaseSeeder {
  async execute() {
    for (const c of CUSTOMERS) {
      await this.database.query(
        "INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [c.name, c.email, c.phone],
      );
    }
    return CUSTOMERS.length;
  }
}
