import { BaseSeeder } from "./BaseSeeder.js";
import { AdminSeeder } from "./AdminSeeder.js";
import { CustomerSeeder } from "./CustomerSeeder.js";
import { SupplierSeeder } from "./SupplierSeeder.js";
import { ProductSeeder } from "./ProductSeeder.js";
import { InventorySeeder } from "./InventorySeeder.js";

export class DatabaseSeeder extends BaseSeeder {
  constructor(database, passwordHasher) {
    super(database);
    this.passwordHasher = passwordHasher;
  }

  async execute() {
    const client = await this.database.getClient();

    try {
      await client.query("BEGIN");

      const db = { query: (sql, params) => client.query(sql, params) };

      const admin = new AdminSeeder(db, this.passwordHasher);
      const adminResult = await admin.execute();
      if (adminResult) console.log(`Admin: ${adminResult.email}`);

      const customers = new CustomerSeeder(db);
      console.log(`${await customers.execute()} customers seeded`);

      const suppliers = new SupplierSeeder(db);
      console.log(`${await suppliers.execute()} suppliers seeded`);

      const products = new ProductSeeder(db);
      console.log(`${await products.execute()} products seeded`);

      const inventory = new InventorySeeder(db);
      console.log(`${await inventory.execute()} inventory records seeded`);

      await client.query("COMMIT");
      console.log("Seed complete");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Seed failed:", err.message);
      process.exitCode = 1;
    } finally {
      client.release();
    }
  }
}
