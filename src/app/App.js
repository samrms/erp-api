import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { authRoutes } from "../modules/auth/routes/authRoutes.js";
import { productRoutes } from "../modules/products/routes/productRoutes.js";
import { customerRoutes } from "../modules/customers/routes/customerRoutes.js";
import { saleRoutes } from "../modules/sales/routes/saleRoutes.js";
import { jobRoutes } from "../modules/jobs/routes/jobRoutes.js";
import { supplierRoutes } from "../modules/suppliers/routes/supplierRoutes.js";
import { inventoryRoutes } from "../modules/inventory/routes/inventoryRoutes.js";
import { AuthMiddleware } from "../modules/auth/middleware/AuthMiddleware.js";
import { RBACMiddleware } from "../modules/auth/middleware/RBACMiddleware.js";
import { Swagger } from "./Swagger.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { Logger } from "../infrastructure/logger/Logger.js";

export class App {
  constructor(container) {
    this.app = express();
    this.container = container;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(
      cors({ origin: process.env.ALLOWED_ORIGIN || false, credentials: true }),
    );
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
    const authMw = new AuthMiddleware(this.container.tokenProvider);
    this.auth = authMw;
    this.authorize = new RBACMiddleware();
    this.errorHandler = new ErrorHandler();
    this.logger = new Logger();
  }

  setupRoutes() {
    this.app.get("/health", (req, res) => res.json({ status: "ok" }));
    this.app.get("/ready", async (req, res) => {
      try {
        await this.container.database.query("SELECT 1");
        res.json({ ready: true });
      } catch (e) {
        res.status(503).json({ ready: false });
      }
    });
    this.app.use(
      "/api/v1/auth",
      authRoutes(this.container.authController, this.auth),
    );
    this.app.use(
      "/api/v1/products",
      this.auth.handle,
      this.authorize.handle("product:read"),
      productRoutes(this.container.productController),
    );
    this.app.use(
      "/api/v1/customers",
      this.auth.handle,
      this.authorize.handle("customer:read"),
      customerRoutes(this.container.customerController),
    );
    this.app.use(
      "/api/v1/sales",
      this.auth.handle,
      this.authorize.handle("sale:read"),
      saleRoutes(this.container.saleController),
    );
    this.app.use(
      "/api/v1/jobs",
      this.auth.handle,
      this.authorize.handle("job:read"),
      jobRoutes(this.container.jobController),
    );
    this.app.use(
      "/api/v1/inventory",
      this.auth.handle,
      this.authorize.handle("inventory:read"),
      inventoryRoutes(this.container.inventoryController),
    );
    this.app.use(
      "/api/v1/suppliers",
      this.auth.handle,
      this.authorize.handle("supplier:read"),
      supplierRoutes(this.container.supplierController),
    );
    this.app.use("/docs", Swagger());
    this.app.use(this.errorHandler.handle);
  }

  listen(port) {
    return this.app.listen(port, () =>
      this.logger.info({
        server: "http://localhost:3000/",
        docs: "http://localhost:3000/docs",
      }),
    );
  }
}
