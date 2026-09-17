import { Config } from "./config/Config.js";
import { ApplicationContainer } from "./app/ApplicationContainer.js";
import { App } from "./app/App.js";

const config = new Config();
const container = new ApplicationContainer();
const app = new App(container);
const server = app.listen(config.port);

const graceful = async (_signal) => {
  console.log("Shutting down...");
  server.close(async () => {
    await container.database.close();
    await container.queue.close();
    process.exit(0);
  });
};
process.on("SIGTERM", () => graceful("SIGTERM"));
process.on("SIGINT", () => graceful("SIGINT"));
