import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Config } from "../config/Config.js";
import AuthRoutes from "../modules/auth/routes/authRoutes.js";
import ProductRoutes from "../modules/products/routes/productRoutes.js";
import CustomerRoutes from "../modules/customers/routes/customerRoutes.js";
import SaleRoutes from "../modules/sales/routes/saleRoutes.js";
import JobRoutes from "../modules/jobs/routes/jobRoutes.js";
import SupplierRoutes from "../modules/suppliers/routes/supplierRoutes.js";
import UserRoutes from "../modules/users/routes/userRoutes.js";
import InventoryRoutes from "../modules/inventory/routes/inventoryRoutes.js";
import { RBACMiddleware } from "../modules/auth/middleware/RBACMiddleware.js";
import { Swagger } from "./Swagger.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { Logger } from "../infrastructure/logger/Logger.js";

export class App {
  constructor(container) {
    this.config = new Config();
    this.app = express();
    this.container = container;
    this.logger = new Logger();
    this.errorHandler = new ErrorHandler(this.config);
    this.auth = this.container.authMiddleware;
    this.rbac = new RBACMiddleware();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: this.config.allowedOrigin || false,
        credentials: true,
      }),
    );
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  }

  setupRoutes() {
    const auth = this.auth.handle.bind(this.auth);
    const rbac = this.rbac.handle.bind(this.rbac);

    this.app.get("/api/v1/health", (_req, res) => res.json({ status: "ok" }));
    this.app.get("/api/v1/ready", async (_req, res) => {
      try {
        await this.container.database.query("SELECT 1");
        res.json({ ready: true });
      } catch {
        res.status(503).json({ ready: false });
      }
    });

    this.app.use(
      "/api/v1/auth",
      new AuthRoutes(
        this.container.authController,
        this.auth.handle,
      ).getRouter(),
    );

    this.app.use(
      "/api/v1/products",
      auth,
      rbac("product:read"),
      new ProductRoutes(this.container.productController).getRouter(),
    );

    this.app.use(
      "/api/v1/customers",
      auth,
      rbac("customer:read"),
      new CustomerRoutes(this.container.customerController).getRouter(),
    );

    this.app.use(
      "/api/v1/users",
      auth,
      rbac("user:read"),
      new UserRoutes(
        this.container.userController,
        rbac("user:write"),
      ).getRouter(),
    );

    this.app.use(
      "/api/v1/suppliers",
      auth,
      rbac("supplier:read"),
      new SupplierRoutes(this.container.supplierController).getRouter(),
    );

    this.app.use(
      "/api/v1/sales",
      auth,
      rbac("sale:read"),
      new SaleRoutes(this.container.saleController).getRouter(),
    );

    this.app.use(
      "/api/v1/inventory",
      auth,
      rbac("inventory:read"),
      new InventoryRoutes(this.container.inventoryController).getRouter(),
    );

    this.app.use(
      "/api/v1/jobs",
      auth,
      rbac("job:read"),
      new JobRoutes(this.container.jobController).getRouter(),
    );

    this.app.use("/docs", Swagger());

    this.app.use(this.errorHandler.handle);
  }

  listen(port) {
    return this.app.listen(port, () =>
      this.logger.info({
        server: "http://localhost:" + port + "/",
        docs: "http://localhost:" + port + "/docs",
      }),
    );
  }
}
