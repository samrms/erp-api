import { Config } from "./config/Config.js";
import { ApplicationContainer } from "./app/ApplicationContainer.js";
import { App } from "./app/App.js";
import { seedAdmin } from "./infrastructure/database/bootstrapAdmin.js";

const config = new Config();

if (!config.isMemory) {
  const nodePgm = (await import("node-pg-migrate")).default;
  await nodePgm({
    direction: "up",
    dir: "migrations",
    databaseUrl: config.databaseUrl,
    noLock: true,
  });
}

const container = await new ApplicationContainer().init();

if (config.isMemory) {
  await seedInMemory(container);
} else {
  const seeded = await seedAdmin({
    database: container.database,
    passwordHasher: container.passwordHasher,
  });
  if (seeded) console.log(`Seeded admin user ${seeded.email}`);
}

const app = new App(container);
const server = app.listen(config.port);

const graceful = async (_signal) => {
  console.log("Shutting down...");
  server.close(async () => {
    await container.close();
    process.exit(0);
  });
};
process.on("SIGTERM", () => graceful("SIGTERM"));
process.on("SIGINT", () => graceful("SIGINT"));

async function seedInMemory(container) {
  const { store, passwordHasher, authRepo } = container;

  const hash = await passwordHasher.hash("admin123");

  const perms = [
    "product:read", "customer:read", "supplier:read",
    "sale:read", "inventory:read", "job:read",
    "user:read", "user:write",
  ];
  for (const code of perms) {
    store.permissions.push({ id: store._uuid(), code, name: code, created_at: store._now() });
  }

  const adminRole = { id: store._uuid(), name: "admin", created_at: store._now() };
  store.roles.push(adminRole);

  for (const p of store.permissions) {
    store.rolePermissions.push({ role_id: adminRole.id, permission_id: p.id });
  }

  const admin = await authRepo.create({
    email: "admin@erp.local",
    passwordHash: hash,
    firstName: "Admin",
    lastName: "User",
  });
  store.userRoles.push({ user_id: admin.id, role_id: adminRole.id });

  const customers = ["Acme Corp", "Globex", "Initech", "Hooli", "Pied Piper"];
  for (const name of customers) {
    const id = store._uuid();
    store.customers.push({ id, name, email: null, phone: null, address: null, created_at: store._now(), updated_at: store._now() });
  }

  const suppliers = ["TechParts", "MegaSupply", "GlobalComponents"];
  for (const name of suppliers) {
    const id = store._uuid();
    store.suppliers.push({ id, name, email: null, phone: null, created_at: store._now(), updated_at: store._now() });
  }

  const products = [
    { sku: "WIDGET-001", name: "Widget", price: "9.99" },
    { sku: "GADGET-001", name: "Gadget", price: "24.99" },
    { sku: "GIZMO-001", name: "Gizmo", price: "14.50" },
    { sku: "DOOHICKEY-001", name: "Doohickey", price: "3.75" },
  ];
  for (const p of products) {
    const id = store._uuid();
    store.products.push({ id, ...p, description: null, created_at: store._now(), updated_at: store._now() });
    store.inventory.push({ id: store._uuid(), product_id: id, quantity: 100, updated_at: store._now() });
  }

  console.log("In-memory seed complete: admin@erp.local / admin123");
}
