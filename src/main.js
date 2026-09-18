import { Config } from "./config/Config.js";
import { ApplicationContainer } from "./app/ApplicationContainer.js";
import { App } from "./app/App.js";
import { seedAdmin } from "./infrastructure/database/seed.js";

const config = new Config();
const container = new ApplicationContainer();
const seeded = await seedAdmin({
  database: container.database,
  passwordHasher: container.passwordHasher,
});
if (seeded) console.log(`Seeded admin user ${seeded.email}`);
const app = new App(container);
const server = app.listen(config.port);

const graceful = async (_signal) => {
  console.log("Shutting down...");
  server.close(async () => {
    await container.close();
    await container.database.close();
    await container.queue.close();
    await container.cache.close();
    process.exit(0);
  });
};
process.on("SIGTERM", () => graceful("SIGTERM"));
process.on("SIGINT", () => graceful("SIGINT"));
